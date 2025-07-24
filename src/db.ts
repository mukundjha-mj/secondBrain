import mongoose from "mongoose"
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;



const contentTypes = ['image', 'video', 'article', 'audio'];



const userSchema = new Schema({
    email: { type: String, unique: true },
    password: { type: String, required: true},
    firstName: String,
    lastName: String
})

const tagSchema = new Schema({
    title: { type: String, required: true, unique: true }
})

const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: ObjectId, ref: 'user', required: true, unique: true }
})

const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: ObjectId, ref: 'Tag' }],
    userId: { type: ObjectId, ref: 'user', required: true }
})


const userModel = mongoose.model('user', userSchema);
const tagModel = mongoose.model('Tag', tagSchema)
const linkModel = mongoose.model('link', linkSchema);
const contentModel = mongoose.model('content', contentSchema);

export {
    userModel,
    tagModel,
    linkModel,
    contentModel,
    contentTypes
}