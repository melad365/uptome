'use client';

import { useState } from 'react';
import { AddPickForm } from '@/components/add-pick-form';
import { PicksList } from '@/components/picks-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [activeTab, setActiveTab] = useState('view');
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePickAdded = () => {
    setActiveTab('view');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-12 text-center animate-slide-in-up">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4 animate-float">
              Uptome
            </h1>
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
          </div>
          <p className="text-slate-400 text-lg font-medium">
            Tired of your friends responding with &quot;up to you&quot;? Well, you can leave it all up to me 😉
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="text-purple-400">🎯</span>
            <span className="text-pink-400">🚀</span>
            <span className="text-red-400">💫</span>
          </div>
        </header>

        <div className="glass-effect rounded-2xl p-1 mb-8 animate-slide-in-up">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent gap-1">
              <TabsTrigger 
                value="view" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 rounded-xl py-3"
              >
                <span className="mr-2">👀</span>
                View Picks
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300 rounded-xl py-3"
              >
                <span className="mr-2">➕</span>
                Add Pick
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="view" className="mt-8">
              <PicksList key={refreshKey} />
            </TabsContent>
            
            <TabsContent value="add" className="mt-8">
              <AddPickForm onPickAdded={handlePickAdded} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
