import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FriendsProps {
    title: string;
  friends: string[]
}

export default function Friends({ title, friends }: FriendsProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="flex flex-row gap-1 hover:underline cursor-pointer">
            {title}
            <span className="font-bold">
              {friends.length}
            </span>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
             <ul>
                {friends.map((friend) => (
                  <li key={friend}>{friend}</li>
                ))}
             </ul>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
