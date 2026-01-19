import { Suspense } from 'react';
import VaultClient from '@/components/vault/VaultClient';

export default function VaultPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-zinc-500">Cargando Bóveda...</div>}>
            <VaultClient />
        </Suspense>
    );
}
