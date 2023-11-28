export interface group{
    grpname:string;
    members: string[];

}


// this.service.getUsersLikeComment().subscribe({
//     next: (data) => {
//       const organizedData: { [key: number]: { image: string, liked: number, comments: string[] } } = {};
      
//       data.forEach(user => {
//         const postid = user.postid;
  
//         // Check if the postid is not already in organizedData
//         if (!organizedData.hasOwnProperty(postid)) {
//           organizedData[postid] = { image: user.imgstr, liked: 0, comments: [] };
//         }
  
//         // Increment the liked count for each user, assuming each user represents a like
//         organizedData[postid].liked += 1;
  
//         // Handle null or undefined comments
//         organizedData[postid].comments.push(user.comment || '');
//       });
  
//       // Convert the organized data to an array for easy iteration in the template
//       this.posts = Object.values(organizedData);
//     }
//   });
  