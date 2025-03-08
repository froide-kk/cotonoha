import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Friends from "../friends/friends";
import {
  getFollowerUserIds,
  getFollowingUserIds,
} from "@/app/actions/follows.action";
import { getProfile } from "@/app/actions/profile.actions";
import { getDiaryCounts } from "@/app/actions/dairy.actions";

export default async function Profile() {
  const followingIds = (await getFollowingUserIds()) || [];
  const followerIds = (await getFollowerUserIds()) || [];
  const { profile } = await getProfile();
  const diaryCounts = await getDiaryCounts();

  return (
    <>
      <div className="flex flex-row border-b-2 gap-8 pb-10">
        <div>
          <Avatar>
            <AvatarImage src={profile.icon} />
            <AvatarFallback>名もなき</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">{profile.user_name}</h2>
          <div className="flex flex-row gap-4">
            <div className="flex flex-row gap-1">
              <span>投稿数</span>
              <span className="font-bold">{diaryCounts}</span>
            </div>
            <div>
              <Friends title="フォロワー" friends={followingIds} />
            </div>

            <div>
              <div>
                <Friends title="フォロー中" friends={followerIds} />
              </div>
            </div>
          </div>
          <p>{profile.bio}</p>
        </div>
      </div>
    </>
  );
}
