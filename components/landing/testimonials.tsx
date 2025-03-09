"use client"

import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "This platform has completely changed how I think about investing. I've been able to build a diversified portfolio with just a small amount of SUI.",
      author: "Alex Thompson",
      role: "Software Developer",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      quote:
        "The investment pools feature is brilliant. I've gained access to opportunities I couldn't afford on my own, and the returns have been impressive.",
      author: "Sarah Chen",
      role: "Marketing Specialist",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      quote:
        "As someone new to crypto, I found this platform incredibly user-friendly. The analytics tools help me make informed decisions about my investments.",
      author: "Michael Rodriguez",
      role: "Graphic Designer",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  ]

  return (
    <div className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of investors who are building wealth through our platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border bg-background hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="border-t pt-6 flex items-center gap-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

