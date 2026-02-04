import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Marketing Agency Website",
      description: "Modern marketing agency website with advanced animations, interactive elements, and seamless user experience. Features real-time analytics integration and dynamic content management.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1742640507/Marketing_site_vzhgfu.png",
      tags: ["React", "Tailwind", "Framer Motion", "Analytics", "CMS"],
      demoUrl: "https://prfsd.netlify.app/",
      imagePosition: "right" as const,
      featured: true
    },
    {
      id: 2,
      title: "Tech Company Website",
      description: "Sleek and modern website for InfoQuestPro, a tech solutions provider. Features interactive service showcases.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759206929/Capture_gmbswi.png",
      tags: ["NextJs", "Tailwind", "TypeScript", "Framer Motion"],
      demoUrl: "https://info-quest-pro.vercel.app/",
      imagePosition: "left" as const,
      featured: false
    },
    {
      id: 3,
      title: "Tech StartUp Product Website",
      description: "A sleek and modern website for Snapfit, a tech solutions provider. It includes interactive service showcases, a tools listing, pricing page, dynamic inspiration page, and contact page — all designed for a seamless user experience.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759207689/Capture_a2ytbu.png",
      tags: ["React", "Tailwind", "TypeScript", "Framer Motion"],
      demoUrl: "https://snapfit-hc66.vercel.app/",
      imagePosition: "right" as const,
      featured: true
    },
    {
      id: 4,
      title: "Real Time Chat Application",
      description: "BaatCheet a real time chat application where users can chat with each other in real time. Users can share files, emojis, and images. ",
      image: "https://res.cloudinary.com/deejpsbzq/image/upload/v1770193246/Screenshot_20260204-131815.jpg_qyxzgc.jpg",
      tags: ["React", "Tailwind", "MongoDB", "NodeJS", "Socket.io", "ExpressJS", "Web Sockets"],
      demoUrl: "https://baat-cheet-chat-app.vercel.app/",
      imagePosition: "left" as const,
      featured: true
    },
    {
      id: 5,
      title: "Islamic Hub",
      description: "A comprehensive digital platform for Muslims featuring Quran with multiple translations, Hadith collections, Islamic articles, and an e-commerce section for purchasing Islamic products. Users can browse and buy religious items like prayer mats, Islamic books, clothing, and accessories while accessing authentic Islamic knowledge resources and community features for spiritual growth.",
      image: "https://res.cloudinary.com/deejpsbzq/image/upload/v1770160147/is_ma2bti.png",
      tags: ["React", "Tailwind", "NodeJS", "ExpressJS"],
      demoUrl: "https://islamichub-omega.vercel.app/",
      imagePosition: "right" as const,
      featured: true
    },
    {
      id: 6,
      title: "Library Management System",
      description: "LMS is a desktop application built for the library of the university. It includes features like book management, user management, and borrowing history.",
      image: "https://res.cloudinary.com/deejpsbzq/image/upload/v1770194055/Screenshot_20260204-133305.jpg_avlv5u.jpg",
      tags: ["C#", "WPF", "SQL Server", ".NET"],
      demoUrl: "https://github.com/AbdulHannan-HAH/Library_Managemnt_System",
      imagePosition: "left" as const,
      featured: true
    },
    {
      id: 7,
      title: "Ecommerce Platform",
      description: "EasyShop is a professional project — a full-featured e-commerce platform that offers a seamless shopping experience with advanced product management, secure payment integration, and real-time order tracking.",
      image: "https://res.cloudinary.com/dbbk9wg2i/image/upload/v1759256114/Capture_htgjkq.png",
      tags: ["Nextjs", "Tailwind", "TypeScript", "Supabase"],
      demoUrl: "https://easyshop-three.vercel.app/",
      imagePosition: "right" as const,
      featured: true
    },
    {

      id: 8,
      title: "Frontend of Internee.pk",
      description: "This project holds special significance as it marks the beginning of my professional journey. Developed the complete frontend for Internee.pk during my internship, creating an intuitive platform that connects students with internship opportunities.",
      image: "https://res.cloudinary.com/deejpsbzq/image/upload/v1770195256/123_dzk5iv.png",
      tags: ["HTML", "CSS", "JavaScript", "Tailwind", "Bootstrap"],
      demoUrl: "https://internee-pk-sitefrontend.vercel.app/",
      imagePosition: "left" as const,
      featured: true

    },
  ];

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">
          Projects
        </h2>

        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`grid lg:grid-cols-2 ${project.imagePosition === 'left' ? 'lg:grid-flow-dense' : ''}`}>
                <div className={`p-6 sm:p-8 lg:p-12 flex flex-col justify-center ${project.imagePosition === 'left' ? 'lg:col-start-2' : ''}`}>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={`${project.id}-${tag}-${tagIndex}`}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => window.open(project.demoUrl, '_blank')}
                  >
                    View Project
                  </Button>
                </div>
                <div className={`relative aspect-[4/3] lg:aspect-auto ${project.imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;