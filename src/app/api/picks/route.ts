import { NextRequest, NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const tagIdsParam = searchParams.get('tagIds');
    
    const tagIds = tagIdsParam ? tagIdsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : undefined;
    
    const picks = query || tagIds ? DbService.searchPicks(query || undefined, tagIds) : DbService.getAllPicks();
    
    return NextResponse.json(picks);
  } catch (error) {
    console.error('Error fetching picks:', error);
    return NextResponse.json({ error: 'Failed to fetch picks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, location, date, tags } = body;
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }
    
    const pick = {
      title,
      description,
      location: location || null,
      date: date || null,
    };
    
    const tagNames = Array.isArray(tags) ? tags : [];
    const pickId = DbService.createPick(pick, tagNames);
    
    return NextResponse.json({ id: pickId }, { status: 201 });
  } catch (error) {
    console.error('Error creating pick:', error);
    return NextResponse.json({ error: 'Failed to create pick' }, { status: 500 });
  }
}