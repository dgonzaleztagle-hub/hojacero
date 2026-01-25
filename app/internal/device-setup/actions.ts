'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function registerDevice(data: {
    fingerprint: string;
    owner: string;
    deviceName: string;
}) {
    const supabase = await createClient();

    // 1. Check if fingerprint already exists
    const { data: existing } = await supabase
        .from('team_devices')
        .select('id')
        .eq('fingerprint', data.fingerprint)
        .single();

    if (existing) {
        // Update existing
        const { error } = await supabase
            .from('team_devices')
            .update({
                owner: data.owner,
                device_name: data.deviceName,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

        if (error) throw new Error('Error actualizando dispositivo: ' + error.message);
        return { success: true, message: 'Dispositivo actualizado correctamente' };
    } else {
        // Insert new
        const { error } = await supabase
            .from('team_devices')
            .insert({
                fingerprint: data.fingerprint,
                owner: data.owner,
                device_name: data.deviceName
            });

        if (error) throw new Error('Error registrando dispositivo: ' + error.message);
        return { success: true, message: 'Dispositivo registrado existosamente' };
    }
}
