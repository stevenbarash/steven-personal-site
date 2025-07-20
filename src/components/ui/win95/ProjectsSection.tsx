import { Project } from '@/types';
import { WINDOWS_95_STYLES } from '@/constants';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <div className="win95-content">
      {/* Tab Headers */}
      <div 
        className="bg-[#c0c0c0] border-b-2 border-black flex" 
        style={{
          boxShadow: WINDOWS_95_STYLES.tabShadow
        }}
      >
        <div className="win95-tab-active px-4 py-2 font-mono font-bold text-sm text-black">
          PROJECTS
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        <div className="space-y-6">
          <div className="font-mono font-bold text-black border-b border-black pb-2">
            FEATURED PROJECTS
          </div>
          
          {/* Featured Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProjects.map((project, index) => {
              const IconComponent = project.icon;
              return (
                <a
                  key={index}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="win95-project-card p-4 cursor-pointer hover:bg-gray-100 transition-colors border-2 border-black"
                  style={{
                    boxShadow: WINDOWS_95_STYLES.contentShadow
                  }}
                  aria-label={`View ${project.name}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <IconComponent size={32} className="text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-mono font-bold text-black text-sm mb-1">
                        {project.name}
                      </h3>
                      <p className="font-mono text-xs text-black mb-2">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="inline-block px-2 py-1 text-xs font-mono bg-[#c0c0c0] border border-black text-black"
                              style={{
                                boxShadow: 'inset 1px 1px 0px rgba(255,255,255,0.8), inset -1px -1px 0px rgba(0,0,0,0.3)'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <>
              <div className="font-mono font-bold text-black border-b border-black pb-2 mt-6">
                OTHER PROJECTS
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {otherProjects.map((project, index) => {
                  const IconComponent = project.icon;
                  return (
                    <a
                      key={index}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="win95-icon p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                      aria-label={`View ${project.name}`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <IconComponent size={24} className="text-black" />
                        <span className="text-xs font-mono font-bold text-black text-center">
                          {project.name}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 