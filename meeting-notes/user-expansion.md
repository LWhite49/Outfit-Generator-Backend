# 11/11/2024

# General wants:

# User architexture with three main features:

# 1. Saving outfits to users wardrobe, done automatically when they like an outfit, where wardrobe is accessible from home page

    - Wardrobe will store saved yser outfits forever, without their TTL index so they are saved to curate a vibe a la Pinterest

# 2. Using the user wardrobe to iteratively manage a unique embedded vector passed to the reccomendation algorithm specific to each user

# 3. Authentication and Verification through Clerk

# Better classification via PyTorch:

# 1. Similar to colorizer, analyze images to add casual / formal / sport and seasonal features to each piece of clothing

# 2. These features will be implemented as new vectors into the reccomendation algorithm for more precise outputs

# 3. See kaggle, implemneted via PyTorch: https://discord.com/channels/1242896154409308231/1242896154409308234/1305601830201331792

# Mobile App Development via React Expo:

# 1. Figure out which libraries are compatable with React Expo, finding alrenatives when needed

# 2. Assess performance bottlenecks between Backend, Python, Databasing

# 3. Ensure connection to backend server, and redesign UI for mobile app with real wireframes for big boys

# We have decided, given our workload and goals to have mobile app launched by end of the year

# It is best for us to spend the rest of the semester learning technologies to facilitate mobile

# Luke:

-   Research compatability between React and React Native Expo
-   Assess bottleneck between backend / database / python for optimal performace

# Patrick:

-   Learn PyTorch to create server-side tool similar to colorizer to add casual / sport / formal attribute to clothing
-   Also add seasonal attribute assessed by the same server-side tool
-   Create shape of user specific vector for ML Model, as well as the ways it will be incrementally changed on wardrobe update
-   Update ML Model to accept additional vectors for these attributes, as well as the user created vector

# Logan:

-   Learn Clerk for full-stack user Authentication
-   Plan layout and UX flow of app
-   Work with Amber to start making wireframes for these layouts

# Ideally, if we can have most of these done by the end of the semester we will be ready to start working towards app launch in december
