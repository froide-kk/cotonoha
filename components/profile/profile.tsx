import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  return (
    <>
      <div className="flex flex-row border-b-2 gap-8 pb-10">
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">My Name</h2>
          <div className="flex flex-row gap-4">
            <div>
              <span>投稿数</span>
              <span> 100</span>
            </div>
            <div>
              <span>フォロワー</span>
              <span> 100</span>
            </div>
            <div>
              <div>
                <span>フォロー中</span>
                <span> 100</span>
              </div>
            </div>
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
            quisquam fugit sapiente voluptatibus quod harum doloremque animi
            commodi obcaecati quo repellendus sit quae, necessitatibus vero
            suscipit perferendis veniam. Fugiat, fuga.
          </p>
        </div>
      </div>
    </>
  );
}
