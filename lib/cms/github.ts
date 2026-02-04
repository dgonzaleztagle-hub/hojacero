import { Octokit } from 'octokit';

/**
 * HOJACERO CMS - GITHUB ENGINE
 * Este wrapper maneja la persistencia standalone sin bases de datos.
 * Todo cambio genera un commit en el repositorio del cliente.
 */

interface GithubConfig {
    owner: string;
    repo: string;
    auth: string; // GitHub Token
    branch?: string;
}

export class GithubCMS {
    private octokit: Octokit;
    private config: GithubConfig;

    constructor(config: GithubConfig) {
        this.octokit = new Octokit({ auth: config.auth });
        this.config = { ...config, branch: config.branch || 'main' };
    }

    /**
     * Lee un archivo JSON del repositorio.
     */
    async getFile(path: string): Promise<{ data: any; sha: string }> {
        try {
            const { data } = await this.octokit.rest.repos.getContent({
                owner: this.config.owner,
                repo: this.config.repo,
                path,
                ref: this.config.branch,
            });

            if ('content' in data && typeof data.content === 'string') {
                const content = Buffer.from(data.content, 'base64').toString('utf-8');
                return {
                    data: JSON.parse(content),
                    sha: data.sha,
                };
            }
            throw new Error('Formato de archivo no válido');
        } catch (error) {
            console.error(`[GithubCMS] Error leyendo ${path}:`, error);
            throw error;
        }
    }

    /**
     * Actualiza o crea un archivo JSON realizando un commit.
     */
    async updateFile(path: string, content: any, message: string, sha?: string) {
        try {
            const jsonString = JSON.stringify(content, null, 2);
            const base64Content = Buffer.from(jsonString).toString('base64');

            const response = await this.octokit.rest.repos.createOrUpdateFileContents({
                owner: this.config.owner,
                repo: this.config.repo,
                path,
                message,
                content: base64Content,
                sha,
                branch: this.config.branch,
            });

            return response.data;
        } catch (error) {
            console.error(`[GithubCMS] Error actualizando ${path}:`, error);
            throw error;
        }
    }
}
