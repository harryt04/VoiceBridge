import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getMongoClient, mongoDBConfig } from '@/lib/mongoClient'
import { extractParamFromUrl } from '@/lib/utils'
import { speakerAuthCheck } from '@/lib/speakerAuthCheck'

export async function GET(req: NextRequest) {
  const user = getAuth(req)
  const speakerId = extractParamFromUrl(req, 'speakerId')

  try {
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await getMongoClient()
    const db = client.db(mongoDBConfig.dbName)
    const activitiesCollection = db.collection(
      mongoDBConfig.collections.activities,
    )

    speakerAuthCheck(req, speakerId as string)

    // Query the "places" collection for documents created by the user
    const activities = await activitiesCollection
      .find({ speakerId: speakerId })
      .toArray()

    // Return the places as JSON
    return NextResponse.json(activities, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}