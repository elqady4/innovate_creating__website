'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Zap } from 'lucide-react'

interface Section {
  type: string
  title: string
  content: string
}

interface WebsiteIdeaResponse {
  _id: string; 
  idea: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [idea, setIdea] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<WebsiteIdeaResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) {
      setError('Please enter a website idea')
      return
    }

    setIsLoading(true)
    setError('')
    setGeneratedContent(null)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate website sections')
      }

      const data = await response.json()

      // Start the generation animation
      setIsGenerating(true)

      // Simulate processing time with animations
      setTimeout(() => {
        setGeneratedContent(data)
        setIsGenerating(false)
        setIsLoading(false)
      }, 2500)

    } catch (err) {
      setError('An error occurred while generating your website. Please try again.')
      setIsLoading(false)
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Website Idea Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your website ideas into stunning landing page sections with AI-powered generation
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className={`transition-all duration-500 ${isGenerating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Your Website Idea
              </CardTitle>
              <CardDescription>
                Enter your website concept and we'll generate professional landing page sections for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="e.g., Landing page for bakery"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    disabled={isLoading}
                    className="text-lg"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Website Sections
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Loading/Generation State */}
        {isGenerating && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Creating your website sections...</span>
              </div>
            </div>

            {/* Loading Skeletons */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Generated Content */}
        {generatedContent && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Website sections generated successfully!
                </span>
              </div>
            </div>

            <div className="space-y-8">
              {generatedContent.sections.map((section, index) => (
                <Card
                  key={index}
                  className="overflow-hidden transition-all duration-500 transform opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 800}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{section.title}</CardTitle>
                      <Badge variant="secondary">{section.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={() => {
                  setGeneratedContent(null)
                  setIdea('')
                }}
                variant="outline"
                size="lg"
              >
                Generate Another Website
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}