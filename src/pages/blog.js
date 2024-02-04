// import fs from 'fs';
// import path from 'path';
// import Link from 'next/link';
// import MenuBar from '../components/menubar'
// export default function Blog({ posts }) {
//     return (
//         <div>
//             <MenuBar/>
//             <h1>Blog Posts</h1>
//             <ul>
//                 {posts.map((post) => (
//                     <li key={post.slug}>
//                         <Link href={`/posts/${post.slug}`}>
//                             <a>{post.title}</a>
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
import MenuBar from "../components/menubar";

// export async function getStaticProps() {
//     const postsDirectory = path.join(process.cwd(), 'Posts');
//     const filenames = fs.readdirSync(postsDirectory);

//     const posts = filenames.map((filename) => {
//         const filePath = path.join(postsDirectory, filename);
//         const fileContents = fs.readFileSync(filePath, 'utf8');

//         // Assuming the markdown files have a front matter with a "title" field
//         const match = fileContents.match(/title:\s*(.*)/);
//         const title = match && match[1] ? match[1] : '';

//         // Extracting the slug from the filename
//         const slug = filename.replace(/\.md$/, '');

//         return {
//             title,
//             slug,
//         };
//     });

//     return {
//         props: {
//             posts,
//         },
//     };
// }

export default function Blog() {
    <MenuBar/>
    return (
        <div>
        </div>
    );
}