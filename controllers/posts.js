import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// Get a single post by ID
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch a post by its unique ID
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    // Handle errors, such as when the post is not found
    res.status(404).json({ message: error.message });
  }
};

// Get paginated list of posts
export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    // Calculate the starting index of posts for the requested page
    const startIndex = (Number(page) - 1) * LIMIT;

    // Get the total number of posts
    const total = await PostMessage.countDocuments({});
    // Fetch a paginated list of posts sorted by ID in descending order
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    // Handle errors, such as database errors or invalid queries
    res.status(404).json({ message: error.message });
  }
};

// Get posts based on search query and tags
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    // Create a case-insensitive regular expression for the search query
    const title = new RegExp(searchQuery, "i");

    // Fetch posts that match the title or contain any of the specified tags
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    // Handle errors, such as database errors or invalid queries
    res.status(404).json({ message: error.message });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const post = req.body;
  // Create a new post with additional metadata (creator and creation date)
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    // Save the new post to the database
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    // Handle errors, such as duplicate posts or database issues
    res.status(409).json({ message: error.message });
  }
};

// Update a post by ID
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  // Find and update the post by ID, returning the updated post
  const updatePost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  );

  res.json(updatePost);
};

// Delete a post by ID
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  // Find and remove the post by ID
  await PostMessage.findByIdAndRemove(id);
  res.json({ message: "Post deleted successfully" });
};

// Like a post by ID
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthenticated!" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  // Find the post by ID
  const post = await PostMessage.findById(id);

  // Check if the user has already liked the post
  const index = post.likes.findIndex((id) => id === String(req.userId));

  // Toggle the user's like status on the post
  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  // Update the post with the new like status
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

// Comment on a post by ID
export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  // Find the post by ID
  const post = await PostMessage.findById(id);

  // Add the new comment to the post
  post.comments.push(value);

  // Update the post with the new comment
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
};
