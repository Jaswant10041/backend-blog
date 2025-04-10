const mongoose = require("mongoose");
const Users = require("../models/userModel");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = new mongoose.Schema(
  {
    slug: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "Not mentioned anything",
    },
    body: {
      type: String,
      default: "Not mentioned anything",
    },
    tags: {
      type: [String],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    favouritesCount: {
      type: Number,
      default: 0,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);
Schema.plugin(uniqueValidator);
Schema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      replacement: "-",
    });
  }
  next();
});
Schema.methods.toArticleResponse = async function (author) {
  console.log(author);
  // const authorObj=await Users.findById(id);
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favourites: this.favouritesCount,
    author: author.toProfileJSON(),
  };
};
const model = mongoose.model("articles", Schema);
module.exports = model;
