/**
 * HOJACERO CMS - TYPE SYSTEM
 * Definiciones nucleares para el motor Standalone.
 */

export type CMSFieldType = 'text' | 'price' | 'image' | 'rich-text' | 'list';

export interface CMSField {
    id: string;
    label: string;
    type: CMSFieldType;
    description?: string;
    placeholder?: string;
}

export interface CMSCategory {
    name: string;
    fields: CMSField[];
}

export interface CMSConfig {
    categories: CMSCategory[];
}

export interface CMSContent {
    [key: string]: any;
}

export interface CMSState {
    isEditing: boolean;
    data: CMSContent;
    config: CMSConfig | null;
    isLoading: boolean;
}

export interface EditableProps {
    id: string;
    label?: string;
    type?: CMSFieldType;
    children: (content: any) => React.ReactNode;
    fallback: any;
}export interface Site {
    id: string;
    client_name: string;
    site_url: string;
    github_repo: string;
    github_owner: string;
    github_branch?: string;
    status: string;
    credentials?: any;
    cms_active: boolean;
    cms_config: any;
}
