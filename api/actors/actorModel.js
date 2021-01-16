import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const ActorSchema = new Schema({
  adult: { type: Boolean },
  id: { type: Number, required: true, unique: true },
  profile_path: { type: String },
  name: { type: String },
  popularity: { type: Number },
  known_for: [
      {
        poster_path: { type: String },
        adult: { type: Boolean },
        overview: { type: String },
        release_date: { type: String },
        original_title: { type: String },
        genre_ids: [{ type: Number }],
        id: { type: Number },
        meida_type: { type: String },
        original_language: { type: String },
        title: { type: String },
        backdrop_path: { type: String },
        popularity: { type: Number },
        vote_count: { type: Number },
        video: { type: Boolean },
        vote_average: { type: Number }
      },
      {
        poster_path: { type: String },
        adult: { type: Boolean },
        overview: { type: String },
        release_date: { type: String },
        original_title: { type: String },
        genre_ids: [{ type: Number }],
        id: { type: Number },
        meida_type: { type: String },
        original_language: { type: String },
        title: { type: String },
        backdrop_path: { type: String },
        popularity: { type: Number },
        vote_count: { type: Number },
        video: { type: Boolean },
        vote_average: { type: Number }
      },
      {
        poster_path: { type: String },
        adult: { type: Boolean },
        overview: { type: String },
        release_date: { type: String },
        original_title: { type: String },
        genre_ids: [{ type: Number }],
        id: { type: Number },
        meida_type: { type: String },
        original_language: { type: String },
        title: { type: String },
        backdrop_path: { type: String },
        popularity: { type: Number },
        vote_count: { type: Number },
        video: { type: Boolean },
        vote_average: { type: Number }
      }
  ]
});

ActorSchema.statics.findByActorDBId = function (id) {
  return this.findOne({ id: id });
};

export default mongoose.model('Actors', ActorSchema);


