'use server'

import { createClient } from "@/utils/supabase/server";



export async function getFollowingUserIds() {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data } = await supabase.from('follows').select('follower_id, following_id, profiles( user_name )').eq('follower_id', user?.id);
        const followingIds = data?.map(item => item.following_id);
        return followingIds;
    } catch (e) {
        console.error(e);
    }
}

export async function getFollowerUserIds() {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data } = await supabase.from('follows').select('follower_id, following_id, profiles( user_name )').eq('following_id', user?.id);
        const followeredIds = data?.map(item => item.follower_id);
        return followeredIds;
    } catch (e) {
        console.error(e);
    }
}