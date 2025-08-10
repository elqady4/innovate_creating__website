import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface GenerateRequest {
  idea: string
}

interface Section {
  type: string
  title: string
  content: string
}

function generateSections(idea: string): Section[] {
  const sections: Section[] = []
  
  // Hero section (always included)
  const heroTitles = [
    `Welcome to ${idea}`,
    `Discover ${idea}`,
    `Experience ${idea}`,
    `${idea} - Where Dreams Come True`,
    `Your Journey with ${idea} Begins Here`
  ]
  
  const heroContents = [
    `Transform your vision into reality with our innovative ${idea.toLowerCase()} solution. We bring cutting-edge technology and creative design together to deliver exceptional results that exceed your expectations.`,
    `Step into the future of ${idea.toLowerCase()} with our comprehensive platform. Designed with precision and crafted with care, we offer unparalleled experiences that resonate with your audience.`,
    `Elevate your standards with our premium ${idea.toLowerCase()} services. We combine expertise, innovation, and passion to create solutions that make a lasting impact in your industry.`
  ]
  
  sections.push({
    type: 'Hero',
    title: heroTitles[Math.floor(Math.random() * heroTitles.length)],
    content: heroContents[Math.floor(Math.random() * heroContents.length)]
  })
  
  // Context-aware section (About or Services)
  const isService = idea.toLowerCase().includes('service') || 
                   idea.toLowerCase().includes('consulting') || 
                   idea.toLowerCase().includes('agency') ||
                   idea.toLowerCase().includes('shop') ||
                   idea.toLowerCase().includes('store')
  
  if (isService) {
    const serviceTitles = [
      'Our Services',
      'What We Offer',
      'Expert Solutions',
      'Professional Services',
      'How We Can Help'
    ]
    
    const serviceContents = [
      `We provide comprehensive ${idea.toLowerCase()} solutions tailored to your unique needs. Our team of experts delivers exceptional service quality, innovative approaches, and measurable results that drive your business forward.`,
      `Discover our range of specialized ${idea.toLowerCase()} services designed to help you achieve your goals. From strategy to execution, we're your trusted partner in success and growth.`,
      `Experience the difference with our professional ${idea.toLowerCase()} services. We combine industry expertise with cutting-edge technology to deliver solutions that transform your business.`
    ]
    
    sections.push({
      type: 'Services',
      title: serviceTitles[Math.floor(Math.random() * serviceTitles.length)],
      content: serviceContents[Math.floor(Math.random() * serviceContents.length)]
    })
  } else {
    const aboutTitles = [
      'Our Story',
      'About Us',
      'Who We Are',
      'Our Mission',
      'Our Journey'
    ]
    
    const aboutContents = [
      `Founded with a passion for excellence, our ${idea.toLowerCase()} platform represents years of dedication and innovation. We believe in creating meaningful experiences that connect with people and inspire positive change.`,
      `Our journey began with a simple vision: to revolutionize the ${idea.toLowerCase()} industry. Today, we stand as a testament to what's possible when creativity meets expertise and determination.`,
      `We are more than just a ${idea.toLowerCase()} provider; we are your partners in success. Our story is built on trust, innovation, and an unwavering commitment to delivering exceptional value.`
    ]
    
    sections.push({
      type: 'About',
      title: aboutTitles[Math.floor(Math.random() * aboutTitles.length)],
      content: aboutContents[Math.floor(Math.random() * aboutContents.length)]
    })
  }
  
  // Contact section (always included)
  const contactTitles = [
    'Get In Touch',
    'Contact Us',
    'Reach Out',
    'Let\'s Connect',
    'Visit Us'
  ]
  
  const contactContents = [
    `Ready to take the next step? Contact us today to discuss how our ${idea.toLowerCase()} solutions can help you achieve your goals. We're here to answer your questions and guide you on your journey.`,
    `Have questions about our ${idea.toLowerCase()} services? Our friendly team is standing by to provide the answers and support you need. Let's start a conversation about your future.`,
    `Connect with us to explore the possibilities of our ${idea.toLowerCase()} platform. Whether you're just starting or looking to expand, we're committed to helping you succeed every step of the way.`
  ]
  
  sections.push({
    type: 'Contact',
    title: contactTitles[Math.floor(Math.random() * contactTitles.length)],
    content: contactContents[Math.floor(Math.random() * contactContents.length)]
  })
  
  return sections
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    
    // Validate input
    if (!body.idea || !body.idea.trim()) {
      return NextResponse.json(
        { error: 'Website idea is required' },
        { status: 400 }
      )
    }
    
    const idea = body.idea.trim()
    
    // Generate sections based on the idea
    const sections = generateSections(idea)
    
    // Save to database
    const websiteIdea = await db.websiteIdea.create({
      data: {
        idea,
        sections: {
          create: sections.map((section, index) => ({
            type: section.type,
            title: section.title,
            content: section.content,
            order: index
          }))
        }
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    
    // Format response
    const response = {
      idea: websiteIdea.idea,
      sections: websiteIdea.sections.map(section => ({
        type: section.type,
        title: section.title,
        content: section.content
      })),
      createdAt: websiteIdea.createdAt.toISOString()
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error generating website sections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}