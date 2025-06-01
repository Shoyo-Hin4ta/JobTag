'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SpaceBackground } from '@/components/custom/space-background';
import { FloatingParticles } from '@/components/custom/floating-particles';
import { GlassCard } from '@/components/custom/glass-card';
import { 
  Brain, Folder, Satellite, Star, Rocket, 
  Sparkles, CheckCircle2, ArrowRight,
  Mail, CheckSquare, Shield, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export default function GSAPScrollytellingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const scenesRef = useRef<HTMLDivElement[]>([]);
  const [currentScene, setCurrentScene] = useState(0);

  // Track which animations have been triggered
  const animationFlags = useRef({
    scene2: false,
    scene3: false,
    scene4: false,
    scene5: false,
    scene6: false,
    numbers: false,
    particles: false
  });

  // Scene content
  const scenes = [
    {
      id: 'hero',
      title: 'Track Jobs While Sleeping',
      subtitle: 'Turn your messy inbox into a career command center',
      icon: Rocket,
    },
    {
      id: 'problem',
      title: 'Your Inbox is a Mess',
      subtitle: 'Job emails lost in chaos, opportunities slipping away',
      icon: Mail,
    },
    {
      id: 'solution',
      title: 'AI Makes it Beautiful',
      subtitle: 'Smart parsing, auto-labeling, instant organization',
      icon: Brain,
    },
    {
      id: 'pricing',
      title: 'Simple, Transparent Pricing',
      subtitle: 'Start free, upgrade when you need more power',
      icon: Sparkles,
    },
    {
      id: 'testimonials',
      title: 'Join 1,000+ Job Seekers',
      subtitle: "Who've upgraded their job hunt to the space age",
      icon: Star,
    },
    {
      id: 'cta',
      title: 'Ready to Launch?',
      subtitle: 'Your dream job is waiting in your inbox',
      icon: Rocket,
    }
  ];

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
      
      // DON'T reset animation flags - preserve them across refreshes
      
      // Add a subtle parallax effect that works in both directions
      // const parallaxElements = containerRef.current?.querySelectorAll('[data-speed]');
      
      // Global section visibility manager - ensures sections stay vibrant
      // const ensureSectionVisibility = (sectionElements: (Element | null)[]) => {
      //   const validElements = sectionElements.filter((el): el is Element => el !== null);
      //   if (validElements.length > 0) {
      //     gsap.set(validElements, {
      //       opacity: 1,
      //       visibility: 'visible'
      //     });
      //   }
      // };
      
      // Progress tracking
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const scene = Math.floor(progress * scenes.length);
          setCurrentScene(Math.min(scene, scenes.length - 1));
          
          gsap.to(progressRef.current, {
            scaleX: progress,
            duration: 0.1,
            ease: 'none'
          });
        }
      });

      // Scene 1: Hero animations
      const scene1 = scenesRef.current[0];
      if (scene1) {
        const heroTitle = scene1.querySelector('.hero-title');
        const heroSubtitle = scene1.querySelector('.hero-subtitle');
        const heroButton = scene1.querySelector('.hero-cta');
        
        // Set initial states for smooth entrance animations - button same as subtitle
        gsap.set([heroTitle, heroSubtitle, heroButton], { 
          opacity: 0, 
          y: 60,
          scale: 0.9,
          visibility: 'visible'
        });
        
        // Hero entrance animation sequence
        const heroTl = gsap.timeline({ delay: 0.3 });
        
        // Main title entrance
        heroTl.to(heroTitle, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out'
        })
        // Subtitle and button appear together with slight delay
        .to(heroSubtitle, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.6')
        .to(heroButton, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.15,
          ease: 'back.out(1.7)',
          onStart: () => {
            // Add gradient class when animation starts
            heroButton?.classList.add('gradient-primary');
          }
        }, '-=1.0'); // Start at the same time as subtitle
      }

      // Scene 2: Horizontal Scroll Email Chaos
      const scene2 = scenesRef.current[1];
      if (scene2 && window.innerWidth >= 768) { // Only on desktop
        const horizontalContainer = scene2.querySelector('.horizontal-container');
        const stage1 = scene2.querySelector('.stage-1');
        const emails = stage1?.querySelectorAll('.email-card');
        const title = stage1?.querySelector('h2');
        const arrowContainer = scene2.querySelector('.arrow-container');
        const arrowIcon = scene2.querySelector('.arrow-icon');
        
        console.log('Scene 2 Debug:', {
          scene2,
          horizontalContainer,
          stage1,
          emailsCount: emails?.length,
          title
        });
        
        if (!emails || emails.length === 0) {
          console.error('No email cards found in Scene 2');
          return;
        }
        
        // Generate scattered positions for emails
        const emailPositions = Array.from(emails).map(() => ({
          left: gsap.utils.random(5, 75),
          top: gsap.utils.random(10, 80),
          rotation: gsap.utils.random(-45, 45),
          finalRotation: gsap.utils.random(-20, 20),
          scale: gsap.utils.random(0.85, 1.15)
        }));
        
        // Apply positions to emails
        emails?.forEach((email, i) => {
          (email as HTMLElement).style.left = `${emailPositions[i].left}%`;
          (email as HTMLElement).style.top = `${emailPositions[i].top}%`;
        });
        
        // Create horizontal scroll timeline
        const horizontalTl = gsap.timeline({
          scrollTrigger: {
            trigger: scene2,
            start: "top top",
            end: "+=300%", // 3x viewport height
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          }
        });
        
        // Horizontal movement for container
        horizontalTl.to(horizontalContainer, {
          x: "-200vw", // Move 2 screens left (3 stages total)
          ease: "none",
          duration: 1
        });
        
        // Initial animations for Stage 1
        if (title && emails) {
          gsap.set(title, { opacity: 0, y: 50 });
          gsap.set(emails, { 
            opacity: 0, 
            scale: (i) => emailPositions[i].scale * 0.5,
            rotation: (i) => emailPositions[i].rotation
          });
          
          // Animate title and emails on enter
          ScrollTrigger.create({
            trigger: scene2,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              // Title animation
              gsap.to(title, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'back.out(1.4)'
              });
              
              // Emails animate in
              gsap.to(emails, {
                opacity: 1,
                scale: (i) => emailPositions[i].scale,
                rotation: (i) => emailPositions[i].finalRotation,
                duration: 1.8,
                stagger: {
                  each: 0.2,
                  from: 'random'
                },
                ease: 'elastic.out(1, 0.8)',
                delay: 0.6,
                onComplete: () => {
                  // Add floating animation
                  emails.forEach((email, i) => {
                    gsap.to(email, {
                      y: `+=${gsap.utils.random(10, 15) * (i % 2 ? 1 : -1)}`,
                      rotation: `+=${gsap.utils.random(3, 5) * (i % 2 ? -1 : 1)}`,
                      duration: gsap.utils.random(2, 4),
                      repeat: -1,
                      yoyo: true,
                      ease: 'sine.inOut',
                      delay: i * 0.2
                    });
                  });
                }
              });
            }
          });
        }
        
        // Stage 2: Arrow animation
        if (arrowContainer && arrowIcon) {
          gsap.set(arrowContainer, { 
            opacity: 0,
            x: -100
          });
          
          ScrollTrigger.create({
            trigger: scene2,
            start: "top top",
            end: "+=300%",
            scrub: true,
            onUpdate: (self) => {
              // Show arrow when we're about 30% through the scroll
              if (self.progress > 0.3 && self.progress < 0.7) {
                const localProgress = (self.progress - 0.3) / 0.4;
                gsap.to(arrowContainer, {
                  opacity: localProgress,
                  x: -100 + (100 * localProgress),
                  duration: 0.1,
                  ease: "none"
                });
                
                // Pulse animation for arrow
                if (localProgress > 0.8 && !arrowIcon.classList.contains('pulsing')) {
                  arrowIcon.classList.add('pulsing');
                  gsap.to(arrowIcon, {
                    scale: 1.2,
                    duration: 0.6,
                    repeat: -1,
                    yoyo: true,
                    ease: "power2.inOut"
                  });
                }
              } else if (self.progress <= 0.3) {
                gsap.to(arrowContainer, {
                  opacity: 0,
                  x: -100,
                  duration: 0.1
                });
              }
            }
          });
        }
      }

      // Scene 3: AI Solution
      const scene3 = scenesRef.current[2];
      if (scene3) {
        const title = scene3.querySelector('h2');
        const features = scene3.querySelectorAll('.feature-card');
        
        gsap.set(title, { opacity: 0, y: 50 });
        gsap.set(features, { opacity: 0, y: 60, scale: 0.9 });

        ScrollTrigger.create({
          trigger: scene3,
          start: 'top 70%',
          end: 'bottom 30%',
          once: true,
          onEnter: () => {
            if (!animationFlags.current.scene3) {
              animationFlags.current.scene3 = true;
              
              // Enhanced title animation with glow effect
              gsap.fromTo(title,
                { opacity: 0, y: 60, rotationX: -15 },
                {
                  opacity: 1,
                  y: 0,
                  rotationX: 0,
                  duration: 1.2,
                  ease: 'power3.out',
                  onComplete: () => {
                    // Add subtle glow effect
                    gsap.to(title, {
                      textShadow: '0 0 30px rgba(124, 58, 237, 0.5)',
                      duration: 0.8,
                      yoyo: true,
                      repeat: 1
                    });
                  }
                }
              );
              
              // Feature cards with enhanced animations
              gsap.fromTo(features,
                { 
                  opacity: 0, 
                  y: 80, 
                  scale: 0.7,
                  rotationY: -20
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotationY: 0,
                  duration: 1.2,
                  stagger: {
                    each: 0.2,
                    from: 'start'
                  },
                  ease: 'back.out(1.4)',
                  delay: 0.4
                }
              );
            }
          },
          onLeave: () => {
            // Keep features visible when leaving section
          },
          onEnterBack: () => {
            // DON'T retrigger animations when scrolling back
            if (title && features.length > 0) {
              gsap.set([title, features], {
                opacity: 1,
                clearProps: 'all'
              });
            }
          },
          onLeaveBack: () => {
            // Keep features visible when leaving backwards
          }
        });
      }

      // Scene 4: Pricing
      const scene4 = scenesRef.current[3];
      if (scene4) {
        const title = scene4.querySelector('h2');
        const subtitle = scene4.querySelector('p');
        const pricingCards = scene4.querySelectorAll('.pricing-card');
        
        gsap.set(title, { opacity: 0, y: 50 });
        gsap.set(subtitle, { opacity: 0, y: 30 });
        gsap.set(pricingCards, { opacity: 0, y: 80, scale: 0.9 });

        ScrollTrigger.create({
          trigger: scene4,
          start: 'top 70%',
          end: 'bottom 30%',
          once: true,
          onEnter: () => {
            if (!animationFlags.current.scene4) {
              animationFlags.current.scene4 = true;
              
              // Title animation
              gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out'
              });
              
              // Subtitle animation
              gsap.to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out'
              });
              
              // Pricing cards animation
              gsap.to(pricingCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: 'back.out(1.4)',
                delay: 0.4
              });
            }
          }
        });
      }

      // Scene 5: Testimonials
      const scene5 = scenesRef.current[4];
      if (scene5) {
        const title = scene5.querySelector('h2');
        const subtitle = scene5.querySelector('p');
        const testimonialCards = scene5.querySelectorAll('.testimonial-card');
        
        gsap.set(title, { opacity: 0, y: 50 });
        gsap.set(subtitle, { opacity: 0, y: 30 });
        gsap.set(testimonialCards, { opacity: 0, y: 60, scale: 0.9 });

        ScrollTrigger.create({
          trigger: scene5,
          start: 'top 70%',
          end: 'bottom 30%',
          once: true,
          onEnter: () => {
            if (!animationFlags.current.scene5) {
              animationFlags.current.scene5 = true;
              
              // Title animation
              gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out'
              });
              
              // Subtitle animation
              gsap.to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out'
              });
              
              // Testimonial cards staggered animation
              gsap.to(testimonialCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                stagger: {
                  each: 0.15,
                  from: 'start'
                },
                ease: 'power3.out',
                delay: 0.4,
                onComplete: () => {
                  // Add subtle floating animation
                  testimonialCards.forEach((card, i) => {
                    gsap.to(card, {
                      y: '+=10',
                      duration: 3 + i * 0.5,
                      repeat: -1,
                      yoyo: true,
                      ease: 'sine.inOut',
                      delay: i * 0.3
                    });
                  });
                }
              });
            }
          }
        });
      }

      // Scene 6: CTA
      const scene6 = scenesRef.current[5];
      if (scene6) {
        const ctaButton = scene6.querySelector('.cta-button');
        const particles = scene6.querySelectorAll('.particle');
        const titleElements = scene6.querySelectorAll('.cta-title');
        const subtitle = scene6.querySelector('.cta-subtitle');
        
        gsap.set(ctaButton, { opacity: 0, scale: 0.7, y: 80 });
        gsap.set(particles, { opacity: 0, scale: 0 });
        gsap.set(titleElements, { opacity: 0, y: 50 });
        gsap.set(subtitle, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: scene6,
          start: 'top 70%',
          end: 'bottom 30%',
          once: true,
          onEnter: () => {
            if (!animationFlags.current.scene6) {
              animationFlags.current.scene6 = true;
              
              gsap.to(titleElements, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.3,
                ease: 'power3.out'
              });
              
              gsap.to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.6,
                ease: 'power3.out'
              });
              
              gsap.to(ctaButton, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.15,
                delay: 0.8,
                ease: 'back.out(1.7)'
              });
              
              // Particle burst - only once
              if (!animationFlags.current.particles) {
                animationFlags.current.particles = true;
                gsap.to(particles, {
                  opacity: 1,
                  scale: () => gsap.utils.random(0.5, 1.5),
                  x: () => gsap.utils.random(-400, 400),
                  y: () => gsap.utils.random(-400, 400),
                  rotation: () => gsap.utils.random(0, 720),
                  duration: () => gsap.utils.random(3, 5),
                  delay: 1.2,
                  stagger: {
                    each: 0.02,
                    from: 'center'
                  },
                  ease: 'power2.out'
                });
                
                // Continuous floating
                particles.forEach((particle, i) => {
                  gsap.to(particle, {
                    y: '+=30',
                    x: '+=15',
                    rotation: '+=180',
                    duration: 4 + i * 0.1,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: 2 + i * 0.03
                  });
                });
              }
            }
          },
          onLeave: () => {
            // Keep CTA elements visible when leaving section
          },
          onEnterBack: () => {
            // Ensure full visibility when re-entering
            if (titleElements.length > 0 && subtitle && ctaButton) {
              // ensureSectionVisibility([...Array.from(titleElements), subtitle, ctaButton]);
              gsap.set([...Array.from(titleElements), subtitle, ctaButton], {
                opacity: 1,
                visibility: 'visible'
              });
              gsap.to([titleElements, subtitle, ctaButton], {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
              });
            }
          },
          onLeaveBack: () => {
            // Keep CTA elements visible when leaving backwards
          }
        });

        // Button interactions
        if (ctaButton) {
          let isHovering = false;
          
          ctaButton.addEventListener('mouseenter', () => {
            isHovering = true;
            gsap.to(ctaButton, {
              scale: 1.05,
              duration: 0.4,
              ease: 'power2.out'
            });
          });
          
          ctaButton.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const mouseEvent = e as MouseEvent;
            const rect = ctaButton.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const x = (mouseEvent.clientX - centerX) * 0.1;
            const y = (mouseEvent.clientY - centerY) * 0.1;
            
            gsap.to(ctaButton, {
              x: x,
              y: y,
              rotation: x * 0.02,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
          
          ctaButton.addEventListener('mouseleave', () => {
            isHovering = false;
            gsap.to(ctaButton, {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: 'elastic.out(1, 0.3)'
            });
          });
        }
      }

      // Parallax effects
      scenesRef.current.forEach((scene) => {
        const elements = scene.querySelectorAll('[data-speed]');
        
        elements.forEach((el) => {
          const speed = parseFloat(el.getAttribute('data-speed') || '1');
          
          gsap.fromTo(el, 
            { y: -30 * speed },
            {
              y: 30 * speed,
              ease: 'none',
              scrollTrigger: {
                trigger: scene,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });
      });



      }, 0); // End setTimeout
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoaded]);
  
  // Separate effect for ScrollTrigger refresh
  useEffect(() => {
    if (isLoaded) {
      ScrollTrigger.refresh();
    }
  }, [isLoaded, currentScene]);

  // Navigation
  // const scrollToScene = (index: number) => {
  //   const targetScene = scenesRef.current[index];
  //   if (targetScene) {
  //     gsap.to(window, {
  //       scrollTo: targetScene,
  //       duration: 1.5,
  //       ease: 'power3.inOut'
  //     });
  //   }
  // };

  useEffect(() => {
    // Immediately set initial states to prevent flash
    const heroButton = document.querySelector('.hero-cta');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroButton) {
      gsap.set(heroButton, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        visibility: 'visible'
      });
    }
    
    if (heroTitle) {
      gsap.set(heroTitle, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        visibility: 'visible'
      });
    }
    
    if (heroSubtitle) {
      gsap.set(heroSubtitle, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        visibility: 'visible'
      });
    }
    
    // Small delay to ensure DOM is ready for full animation setup
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-x-hidden">
      {/* Fixed background */}
      <div className="fixed inset-0 z-0">
        <SpaceBackground />
        <FloatingParticles />
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div 
          ref={progressRef}
          className="h-full gradient-primary origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>


      {/* Scene 1: Hero */}
      <section 
        ref={el => { if (el) scenesRef.current[0] = el as HTMLDivElement; }}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            className="hero-title text-6xl md:text-8xl font-black mb-6"
            style={{ opacity: 0, transform: 'translateY(60px) scale(0.9)', visibility: 'visible' }}
          >
            <span className="text-white">Track Jobs While</span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 gradient-text">Sleeping</span>
              <span className="absolute inset-0 blur-xl opacity-50 animate-pulse gradient-primary" style={{
                zIndex: -1
              }}></span>
            </span>
          </h1>
          <p 
            className="hero-subtitle text-xl md:text-3xl text-gray-200 mb-12 font-light max-w-3xl mx-auto" 
            data-speed="0.5"
            style={{ opacity: 0, transform: 'translateY(60px) scale(0.9)', visibility: 'visible' }}
          >
            Turn your messy inbox into a <span className="text-secondary font-semibold">career command center</span>
          </p>
          <a 
            href="/auth/login"
            className="hero-cta group relative inline-flex items-center justify-center px-12 py-6 rounded-full text-white font-bold text-xl shadow-2xl transition-all duration-500 overflow-hidden"
            style={{ 
              opacity: 0, 
              transform: 'translateY(60px) scale(0.9)', 
              visibility: 'visible',
              background: 'transparent'
            }}
          >
            <span className="relative z-10 flex items-center justify-center">
              Launch Your Job Search
              <Rocket className="ml-3 w-7 h-7 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--primary)))'
            }} />
          </a>
        </div>
      </section>

      {/* Scene 2: Horizontal Scroll Section */}
      <section 
        ref={el => { if (el) scenesRef.current[1] = el as HTMLDivElement; }}
        className="relative horizontal-scroll-section hidden md:block"
        style={{ height: '100vh' }}
      >
        <div className="horizontal-container" style={{ 
          display: 'flex',
          width: '300vw',
          height: '100%'
        }}>
          {/* Stage 1: Your Inbox is a Mess */}
          <div className="stage stage-1 w-screen h-screen flex items-center justify-center px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 text-white">
                Your Inbox is a <span className="text-destructive">Mess</span>
              </h2>
              <div className="relative h-[500px] max-w-4xl mx-auto" style={{ position: 'relative' }}>
                {[
                  { company: 'Google', subject: 'Re: Your application', color: 'blue' },
                  { company: 'Meta', subject: 'Interview invitation', color: 'purple' },
                  { company: 'Netflix', subject: 'Thank you for applying', color: 'red' },
                  { company: 'Amazon', subject: 'Next steps', color: 'orange' },
                  { company: 'Apple', subject: 'Application received', color: 'gray' },
                  { company: 'Microsoft', subject: 'We received your CV', color: 'green' }
                ].map((email, i) => (
                  <div
                    key={i}
                    className="email-card w-64 h-32 bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-xl"
                    style={{ position: 'absolute', opacity: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-300">{email.company}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{email.subject}</div>
                    <div className="h-2 bg-gray-600 rounded mb-1 w-3/4"></div>
                    <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stage 2: Arrow Introduction */}
          <div className="stage stage-2 w-screen h-screen flex items-center justify-center">
            <div className="arrow-container text-center">
              <h3 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                This is how JobTag transforms your inbox
              </h3>
              <div className="arrow-icon w-24 h-24 mx-auto relative">
                <ArrowRight className="w-full h-full" style={{
                  stroke: 'url(#arrowGradient)',
                  fill: 'none',
                  strokeWidth: '2',
                  filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.5))'
                }} />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(280 100% 70%)" />
                      <stop offset="50%" stopColor="hsl(300 100% 60%)" />
                      <stop offset="100%" stopColor="hsl(200 100% 60%)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Stage 3: Demo Section - Mess Cleaned */}
          <div className="stage stage-3 w-screen h-screen flex items-center justify-center">
            <div className="demo-content max-w-6xl mx-auto px-4">
              <h3 className="text-4xl md:text-6xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Mess Cleaned</span>
                <span className="text-white ml-3">✨</span>
              </h3>
              {/* Before/After transformation */}
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                {/* Before */}
                <GlassCard className="relative overflow-hidden w-full max-w-md">
                  <div className="absolute top-4 left-4 text-sm text-muted-foreground">Before</div>
                  <div className="pt-12 space-y-3 p-6">
                    {[
                      "Re: Your application to Google",
                      "Interview invitation - Meta",
                      "Thank you for applying - Netflix",
                      "Next steps with Amazon",
                      "We received your application - Apple"
                    ].map((subject, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 bg-muted/50 rounded">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">{subject}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Arrow */}
                <div className="hidden lg:block px-8">
                  <ArrowRight className="h-12 w-12 text-primary" />
                </div>

                {/* After */}
                <GlassCard className="relative overflow-hidden w-full max-w-md">
                  <div className="absolute top-4 left-4 text-sm text-muted-foreground">After</div>
                  <div className="pt-12 space-y-3 p-6">
                    {[
                      { company: "Google", status: "Applied", color: "bg-blue-500" },
                      { company: "Meta", status: "Interview", color: "bg-purple-500" },
                      { company: "Netflix", status: "Applied", color: "bg-red-500" },
                      { company: "Amazon", status: "Screening", color: "bg-orange-500" },
                      { company: "Apple", status: "Applied", color: "bg-gray-500" }
                    ].map((job, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div className="flex items-center space-x-3">
                          <CheckSquare className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">{job.company}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${job.color} text-white`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Mobile-only Scene 2: Problem & Demo */}
      <section 
        ref={el => { 
          if (el && typeof window !== 'undefined' && window.innerWidth < 768) {
            scenesRef.current[1] = el as HTMLDivElement;
          }
        }}
        className="relative md:hidden py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
            Your Inbox is a <span className="text-destructive">Mess</span>
          </h2>
          
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Watch it Transform</span>
              <span className="text-white ml-2">✨</span>
            </h3>
            
            <div className="flex flex-col gap-8 items-center">
              {/* Before */}
              <GlassCard className="relative overflow-hidden w-full max-w-md">
                <div className="absolute top-4 left-4 text-sm text-muted-foreground">Before</div>
                <div className="pt-12 space-y-3 p-6">
                  {[
                    "Re: Your application to Google",
                    "Interview invitation - Meta",
                    "Thank you for applying - Netflix"
                  ].map((subject, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-muted/50 rounded">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{subject}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Arrow Down */}
              <ArrowRight className="h-12 w-12 text-primary rotate-90" />

              {/* After */}
              <GlassCard className="relative overflow-hidden w-full max-w-md">
                <div className="absolute top-4 left-4 text-sm text-muted-foreground">After</div>
                <div className="pt-12 space-y-3 p-6">
                  {[
                    { company: "Google", status: "Applied", color: "bg-blue-500" },
                    { company: "Meta", status: "Interview", color: "bg-purple-500" },
                    { company: "Netflix", status: "Applied", color: "bg-red-500" }
                  ].map((job, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div className="flex items-center space-x-3">
                        <CheckSquare className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{job.company}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${job.color} text-white`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 3: Solution */}
      <section 
        ref={el => { if (el) scenesRef.current[2] = el as HTMLDivElement; }}
        className="relative min-h-[90vh] flex items-center justify-center px-4 py-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-12 text-white">
            AI Makes it <span className="text-primary">Beautiful</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <GlassCard className="feature-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-primary/20 rounded-2xl">
                <Brain className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI Email Parser</h3>
              <p className="text-gray-400">Extracts job details with 95% accuracy</p>
            </GlassCard>
            
            <GlassCard className="feature-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-secondary/20 rounded-2xl">
                <Folder className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Auto-Organization</h3>
              <p className="text-gray-400">Labels and sorts applications instantly</p>
            </GlassCard>
            
            <GlassCard className="feature-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-secondary/20 rounded-2xl">
                <Satellite className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Real-time Tracking</h3>
              <p className="text-gray-400">Never miss an opportunity again</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Scene 4: Pricing */}
      <section 
        ref={el => { if (el) scenesRef.current[3] = el as HTMLDivElement; }}
        className="relative min-h-[85vh] flex items-center justify-center px-4 py-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-6 text-white">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Start free, upgrade when you need more power
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="pricing-card relative">
              <GlassCard className="h-full p-8">
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-white">Free Forever</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold text-white">$0</span>
                    </div>
                    <p className="text-gray-400">Perfect for getting started</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">50 applications/month</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Gmail & Outlook support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Basic email parsing</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Auto-labeling</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Dashboard analytics</span>
                    </li>
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant="outline"
                    size="lg"
                  >
                    Start Free
                  </Button>
                </div>
              </GlassCard>
            </div>
            
            {/* Pro Plan */}
            <div className="pricing-card relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Most Popular</span>
                </div>
              </div>
              
              <GlassCard className="h-full p-8 border-primary/50">
                <div className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold text-white">$9</span>
                      <span className="text-gray-400 ml-1">/month</span>
                    </div>
                    <p className="text-gray-400">For serious job seekers</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Unlimited applications</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Priority AI parsing</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Advanced analytics</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Export to CSV/PDF</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Email notifications</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-300">Priority support</span>
                    </li>
                  </ul>
                  
                  <Button
                    className="gradient-primary text-white w-full"
                    size="lg"
                  >
                    Go Pro
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 5: Testimonials */}
      <section 
        ref={el => { if (el) scenesRef.current[4] = el as HTMLDivElement; }}
        className="relative min-h-[85vh] flex items-center justify-center px-4 py-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-6 text-white">
            Join <span className="text-secondary">1,000+</span> Job Seekers
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Who&apos;ve upgraded their job hunt to the space age
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="testimonial-card">
              <GlassCard className="h-full p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">SC</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Sarah Chen</h4>
                      <p className="text-sm text-gray-400">Software Engineer</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300">&ldquo;JobTag transformed my chaotic job search into an organized mission. I landed my dream job at SpaceX!&rdquo;</p>
                </div>
              </GlassCard>
            </div>
            
            {/* Testimonial 2 */}
            <div className="testimonial-card">
              <GlassCard className="h-full p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">MR</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Michael Rodriguez</h4>
                      <p className="text-sm text-gray-400">Product Manager</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300">&ldquo;The auto-labeling feature is incredible. My Gmail looks like a professional ATS system now.&rdquo;</p>
                </div>
              </GlassCard>
            </div>
            
            {/* Testimonial 3 */}
            <div className="testimonial-card">
              <GlassCard className="h-full p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">EW</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Emily Watson</h4>
                      <p className="text-sm text-gray-400">Data Scientist</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300">&ldquo;I was tracking 50+ applications in a spreadsheet. JobTag does it automatically from my emails!&rdquo;</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 6: CTA */}
      <section 
        ref={el => { if (el) scenesRef.current[5] = el as HTMLDivElement; }}
        className="relative min-h-[95vh] flex items-center justify-center px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-2 h-2 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                background: `linear-gradient(135deg, ${i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} 0%, ${i % 2 === 0 ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'} 100%)`
              }}
            />
          ))}
        </div>
        
        <div className="text-center max-w-5xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="cta-title text-white block">Ready to</span>
            <span className="cta-title relative inline-block mt-2">
              <span className="relative z-10 text-6xl md:text-8xl gradient-text">Launch?</span>
              <span className="absolute inset-0 blur-2xl opacity-40 animate-pulse scale-110 gradient-primary" style={{
                zIndex: -1
              }}></span>
            </span>
          </h2>
          <p className="cta-subtitle text-2xl md:text-3xl text-gray-200 mb-16 max-w-3xl mx-auto font-light">
            Your <span className="text-secondary font-semibold">dream job</span> is waiting in your inbox
          </p>
          
          <a href="/auth/login" className="cta-button group relative inline-flex items-center justify-center px-16 py-8 rounded-full text-white font-bold text-2xl shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-110 hover:-translate-y-2 gradient-primary">
            <span className="relative z-10 flex items-center justify-center">
              Start Free Mission
              <Rocket className="ml-4 w-8 h-8 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--primary)))'
            }} />
          </a>
          
          <p className="mt-12 text-xl text-gray-400">
            No credit card required &bull; 50 applications free
          </p>
          
          <div className="mt-8 flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>No Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>5 Min Start</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}