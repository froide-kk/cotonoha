'use client';

import { useState, useRef, FormEvent, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Shadcn UIコンポーネント
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 定数定義
const DEFAULT_AVATAR = '/images/unknown-user-icon.svg';
const MAX_BIO_LENGTH = 100;
const MAX_USERNAME_LENGTH = 30;
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const VALID_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// 型定義
interface Profile {
  id: string;
  user_name: string;
  bio?: string;
  icon?: string;
  is_onboarded: boolean;
}

interface ProfileActionResult {
  success?: boolean;
  error?: string;
}

interface FieldErrors {
  userName?: string;
  bio?: string;
}

interface OnboardingFormProps {
  initialProfile: Profile | null;
  userId: string;
  updateProfileAction: (formData: FormData) => Promise<ProfileActionResult>;
}

export default function OnboardingForm({ 
  initialProfile, 
  userId, 
  updateProfileAction 
}: OnboardingFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ステート管理
  const [userName, setUserName] = useState(initialProfile?.user_name || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(initialProfile?.icon || DEFAULT_AVATAR);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  const bioLength = bio.length;
  const isBioNearLimit = bioLength > MAX_BIO_LENGTH * 0.8;

  // バリデーション関数
  const validateForm = useCallback((): boolean => {
    const errors: FieldErrors = {};
    
    if (!userName.trim()) {
      errors.userName = 'ニックネームは必須です';
      setFieldErrors(errors);
      return false;
    }
    
    if (userName.length > MAX_USERNAME_LENGTH) {
      errors.userName = `ニックネームは${MAX_USERNAME_LENGTH}文字以内で入力してください`;
      setFieldErrors(errors);
      return false;
    }
    
    if (bio && bio.length > MAX_BIO_LENGTH) {
      errors.bio = `自己紹介は${MAX_BIO_LENGTH}文字以内で入力してください`;
      setFieldErrors(errors);
      return false;
    }
    
    setFieldErrors({});
    return true;
  }, [userName, bio]);

  // アバターアップロード処理
  const uploadAvatar = async (file: File): Promise<string | null> => {
    const avatarFileName = `${userId}/${Date.now()}.${file.name.split('.').pop()}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarFileName, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      throw new Error(`画像アップロードエラー: ${uploadError.message}`);
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarFileName);
      
    return data.publicUrl;
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // 送信中または検証エラーの場合は早期リターン
    if (isSubmitting || !validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData(event.currentTarget);
      
      // アバター画像の処理
      if (avatar) {
        try {
          const publicUrl = await uploadAvatar(avatar);
          if (publicUrl) {
            formData.set('avatarUrl', publicUrl);
          }
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : '画像アップロードに失敗しました');
          setIsSubmitting(false);
          return;
        }
      } else if (avatarUrl === DEFAULT_AVATAR) {
        formData.set('avatarUrl', '');
      }
      
      // Server Actionを実行
      const result = await updateProfileAction(formData);
      
      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }
      
      // 成功したらリダイレクト
      router.push('/timeline');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      setIsSubmitting(false);
    }
  };

  // アバター画像選択処理
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // ファイルサイズチェック
    if (file.size > MAX_AVATAR_SIZE) {
      setError('画像サイズは2MB以下にしてください');
      return;
    }
    
    // ファイル形式チェック
    if (!VALID_AVATAR_TYPES.includes(file.type)) {
      setError('JPEG、PNG、GIF、WEBP形式の画像のみアップロード可能です');
      return;
    }
    
    setAvatar(file);
    setError(null);
    
    // プレビュー表示
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);
  };

  // アバター選択ボタンクリック処理
  const handleSelectAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  // アバターリセット処理
  const handleResetAvatar = () => {
    setAvatar(null);
    setAvatarUrl(DEFAULT_AVATAR);
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* エラーメッセージ */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* ユーザーID（hidden） */}
          <input type="hidden" name="userId" value={userId} />

          {/* アバター選択 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={avatarUrl}
                alt="プロフィール画像"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept={VALID_AVATAR_TYPES.join(',')}
                className="hidden"
              />
              
              <Button
                type="button"
                onClick={handleSelectAvatarClick}
                variant="secondary"
                size="sm"
              >
                アバター画像を選択
              </Button>
              
              {avatar && (
                <Button
                  type="button"
                  onClick={handleResetAvatar}
                  variant="outline"
                  size="sm"
                >
                  リセット
                </Button>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              2MB以下のJPEG、PNG、GIF、WEBP形式の画像をアップロードできます。
            </p>
          </div>

          {/* ニックネーム */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="userName" className="text-sm font-medium">
                ニックネーム <span className="text-destructive">*</span>
              </Label>
              {fieldErrors.userName && (
                <p className="text-xs font-medium text-destructive">{fieldErrors.userName}</p>
              )}
            </div>
            <Input
              id="userName"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={fieldErrors.userName ? "ring-2 ring-destructive" : ""}
              placeholder="あなたの表示名を入力してください"
              required
              maxLength={MAX_USERNAME_LENGTH}
            />
            <p className="text-xs text-muted-foreground">
              公開されます。後から変更可能です。
            </p>
          </div>

          {/* 自己紹介 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio" className="text-sm font-medium">
                自己紹介
              </Label>
              <div className="flex items-center space-x-2">
                {fieldErrors.bio && (
                  <p className="text-xs font-medium text-destructive">{fieldErrors.bio}</p>
                )}
                <span className={`text-xs ${isBioNearLimit ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  {bioLength}/{MAX_BIO_LENGTH}
                </span>
              </div>
            </div>
            <Textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`resize-none min-h-[120px] ${fieldErrors.bio ? "ring-2 ring-destructive" : ""}`}
              placeholder="あなたについて簡単に教えてください（任意）"
              maxLength={MAX_BIO_LENGTH}
            />
            <p className="text-xs text-muted-foreground">
              公開されます。後から変更可能です。
            </p>
          </div>

          {/* 送信ボタン */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? '送信中...' : 'プロフィールを完成させる'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}