'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddPickFormProps {
  onPickAdded?: () => void;
}

export function AddPickForm({ onPickAdded }: AddPickFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch('/api/picks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location || null,
          date: formData.date || null,
          tags: tagArray,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create pick');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        tags: '',
      });

      onPickAdded?.();
    } catch (error) {
      console.error('Error creating pick:', error);
      alert('Failed to create pick. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-in-up">
      <Card className="gradient-card border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <span className="text-2xl">🎯</span>
            Add New Pick
          </CardTitle>
          <p className="text-slate-400 mt-2">Create a new activity or entertainment option</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <Label htmlFor="title" className="text-slate-300 font-medium flex items-center gap-2">
                <span>📝</span> Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What's this pick about?"
                required
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="description" className="text-slate-300 font-medium flex items-center gap-2">
                <span>💭</span> Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us more about this pick..."
                rows={3}
                required
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 group">
                <Label htmlFor="location" className="text-slate-300 font-medium flex items-center gap-2">
                  <span>📍</span> Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where is it?"
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="date" className="text-slate-300 font-medium flex items-center gap-2">
                  <span>📅</span> Date & Time
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="tags" className="text-slate-300 font-medium flex items-center gap-2">
                <span>🏷️</span> Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="restaurant, outdoor, fun, relaxing..."
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  Adding Pick...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  Create Pick
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}