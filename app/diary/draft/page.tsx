import { DiaryPostForm } from "@/components/diary/draft/diary-post-form"

export default function NewDiaryPage() {
  return (
    <main className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">下書き：YYYY/MM/DD</h1>
      <DiaryPostForm />
    </main>
  )
}

