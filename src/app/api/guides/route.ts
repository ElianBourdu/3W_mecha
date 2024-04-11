import {GuideRepository} from "@/server/repositories/guide/guide_repository";
import {NextRequest, NextResponse} from "next/server";
import Joi from "joi";
import {EntityAlreadyExists} from "@/server/errors/entity_already_exists";
import {getUserFromToken} from "@/server/services/auth";

// définition du schema Joi pour une première validation des données
// issues du payload de la requête POST
const schema = Joi.object({
  title: Joi.string()
    .min(8)
    .max(255)
    .required(),
  content: Joi.string()
    .min(100)
    .max(100000)
    .required(),
})

// get all guides
export async function GET() {
  return GuideRepository.getAllGuides()
    .then(guideList => {
      return Response.json({
        data: guideList.map(guide => guide.toJson())
      })
    })
    .catch((error: Error) => {
      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}

// Requête de création de Guide
export async function POST(request: NextRequest) {
  const user = await getUserFromToken(request.cookies.get('mechaToken')?.value)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // récupération du payload
  const bodyPayload = await request.json()

  // validation du payload via le schéma Joi définit précédemment
  const { error, value } = schema.validate(bodyPayload, { allowUnknown: false })

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  // déstructuration des valeurs du payload
  const title = value.title
  const content = value.content

  // vérification de la présence d'un guide portant déjà ce titre
  return GuideRepository.getGuideByTitle(title, false)
    .then(async guide => {
      if (guide) {
        throw new EntityAlreadyExists()
      }

      return GuideRepository.createGuide(title, content, user.user__id)
    })
    .then((guide) => {
      return NextResponse.json({ data: guide }, { status: 201 })
    })
    .catch((error) => {
      if (error instanceof EntityAlreadyExists) {
        return NextResponse.json({ error: 'Guide with this title already exists' }, { status: 400 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    })
}