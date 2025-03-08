import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"

interface DiaryPreviewProps {
  diary: {
    title: string
    content: string
    createdAt: Date
    author: {
      name: string
      avatar: string
    }
  }
  showLikes?: boolean
}

export function DiaryPreview({ diary, showLikes = true }: DiaryPreviewProps) {
  // プレビュー表示時の太字、斜体、取り消し線の変換
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      .replace(/<li>(.*?)<\/li>/g, "<ul>$&</ul>")
      .replace(/<\/ul><ul>/g, "")
      .replace(/\n/g, "<br />")
  }

  const formattedTime = formatDistanceToNow(diary.createdAt, {
    addSuffix: true,
    locale: ja,
  })

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={diary.author.avatar} alt={diary.author.name} />
              <AvatarFallback>{diary.author.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{diary.author.name}</p>
              <p className="text-xs text-muted-foreground">{formattedTime}</p>
            </div>
          </div>
          {showLikes && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Heart className="h-4 w-4 mr-1" />
              <span>0</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {diary.title && <h3 className="text-lg font-medium mb-2">{diary.title}</h3>}
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatContent(diary.content) }} />
      </CardContent>
    </Card>
  )
}

