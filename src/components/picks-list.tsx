'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PickWithTags, Tag } from '@/lib/db';
import { formatDate } from '@/lib/date-utils';

export function PicksList() {
  const [picks, setPicks] = useState<PickWithTags[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPicks = async (query?: string, tagIds?: number[]) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (tagIds && tagIds.length > 0) params.append('tagIds', tagIds.join(','));
      
      const response = await fetch(`/api/picks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch picks');
      
      const data = await response.json();
      setPicks(data);
    } catch (error) {
      console.error('Error fetching picks:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      
      const data = await response.json();
      setAllTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPicks(), fetchTags()]);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const handleSearch = async () => {
    await fetchPicks(searchQuery || undefined, selectedTagIds.length > 0 ? selectedTagIds : undefined);
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = async () => {
    setSearchQuery('');
    setSelectedTagIds([]);
    await fetchPicks();
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center space-y-4 animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500 mx-auto"></div>
          <p className="text-slate-400 text-lg">Loading your picks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Search and Filter Section */}
      <Card className="gradient-card border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-xl">🔍</span>
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="search" className="text-slate-300 font-medium flex items-center gap-2 mb-2">
                <span>🔎</span> Search picks
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button 
                onClick={handleSearch} 
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-1">🚀</span> Search
              </Button>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl transition-all duration-300"
              >
                <span className="mr-1">🔄</span> Clear
              </Button>
            </div>
          </div>
          
          {allTags.length > 0 && (
            <div>
              <Label className="text-slate-300 font-medium flex items-center gap-2 mb-3">
                <span>🏷️</span> Filter by tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTagIds.includes(tag.id) ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-full px-3 py-1 ${
                      selectedTagIds.includes(tag.id) 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-glow" 
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Picks List */}
      <div className="grid gap-6">
        {picks.length === 0 ? (
          <Card className="gradient-card border-0 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4 animate-bounce">📝</div>
              <p className="text-slate-400 text-lg mb-2">
                {searchQuery || selectedTagIds.length > 0 
                  ? "No picks found matching your search criteria" 
                  : "No picks yet"}
              </p>
              <p className="text-slate-500 text-sm">
                {searchQuery || selectedTagIds.length > 0 
                  ? "Try adjusting your filters or search terms" 
                  : "Add your first pick to get started!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          picks.map((pick, index) => (
            <Card key={pick.id} className="gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <span className="text-xl text-white font-bold">{pick.title}</span>
                  <div className="flex flex-wrap gap-2">
                    {pick.tags.map((tag) => (
                      <Badge key={tag.id} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full px-2 py-1">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4 text-base leading-relaxed">{pick.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                  {pick.location && (
                    <span className="flex items-center gap-1 text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                      <span>📍</span> {pick.location}
                    </span>
                  )}
                  {pick.date && (
                    <span className="flex items-center gap-1 text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                      <span>📅</span> {formatDate(pick.date)}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-500 text-xs sm:ml-auto bg-slate-800/30 px-3 py-1 rounded-full">
                    <span>✨</span> Added {formatDate(pick.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}