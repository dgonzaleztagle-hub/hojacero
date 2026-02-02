
import AdsFactoryEditor from '@/components/factory/AdsFactoryEditor';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditLandingPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: landing } = await supabase
        .from('h0_landings')
        .select('*')
        .eq('id', id)
        .single();

    if (!landing) {
        // Return dummy data for demo purposes if ID doesn't exist yet
        return <AdsFactoryEditor />;
    }

    return <AdsFactoryEditor initialData={landing} />;
}
