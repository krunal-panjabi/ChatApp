export interface GalleryData {
    caption: string;
    imgstr: string;
    userimage: string |null ;
    uploadedUser: string; 
    galleryId : number | null;
    likeCount : number|null;
    currentUserLiked :any;
  }