import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Upload, Check, Search, Loader2, Image as ImageIcon, Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  created_at: string;
}

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

const MediaLibrary = ({ open, onOpenChange, onSelect }: MediaLibraryProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      loadMedia();
    }
  }, [open]);

  const loadMedia = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMediaItems(data);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to upload images");
      return;
    }

    setIsUploading(true);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("blog-images")
          .getPublicUrl(uploadData.path);

        // Save to media_library table
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            user_id: user.id,
            url: publicUrl.publicUrl,
            name: file.name,
          });

        if (dbError) throw dbError;

        toast.success(`${file.name} uploaded successfully`);
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    setIsUploading(false);
    loadMedia();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addImageByUrl = async () => {
    if (!newImageUrl) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const { error } = await supabase
      .from('media_library')
      .insert({
        user_id: user.id,
        url: newImageUrl,
        name: newImageUrl.split('/').pop() || 'External Image',
      });

    if (error) {
      toast.error('Failed to add image: ' + error.message);
    } else {
      toast.success('Image added to library');
      setNewImageUrl('');
      loadMedia();
    }
  };

  const deleteImage = async (item: MediaItem) => {
    // Try to delete from storage if it's a Supabase storage URL
    if (item.url.includes('blog-images')) {
      const path = item.url.split('blog-images/')[1];
      if (path) {
        await supabase.storage.from('blog-images').remove([path]);
      }
    }

    const { error } = await supabase
      .from('media_library')
      .delete()
      .eq('id', item.id);

    if (error) {
      toast.error('Failed to delete image');
    } else {
      toast.success('Image removed from library');
      setMediaItems(mediaItems.filter(m => m.id !== item.id));
      if (selectedImage === item.url) {
        setSelectedImage(null);
      }
    }
  };

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onOpenChange(false);
      setSelectedImage(null);
    }
  };

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>
            Upload images or select from your library
          </DialogDescription>
        </DialogHeader>

        {/* Upload Section */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link className="h-4 w-4 mr-2" />
              Add by URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 5MB (multiple files supported)
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-4">
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button onClick={addImageByUrl} disabled={!newImageUrl}>
                Add
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images..."
            className="pl-10"
          />
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto min-h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{searchQuery ? 'No images found matching your search' : 'No images in library yet'}</p>
              <p className="text-sm">Upload images to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={`relative group cursor-pointer transition-all hover:shadow-md ${
                    selectedImage === item.url ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(item.url)}
                >
                  <CardContent className="p-1.5">
                    <div className="relative aspect-square overflow-hidden rounded">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {selectedImage === item.url && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          <Check className="w-6 h-6 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(item);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} image{filteredItems.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedImage}>
              Insert Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
