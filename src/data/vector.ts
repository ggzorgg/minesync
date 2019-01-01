import vec3 = require('vec3')
import { VectorLike, toVectorTuple } from '../../immutable3d/vector'

export const asVec3 = (v: VectorLike) => vec3(...toVectorTuple(v))