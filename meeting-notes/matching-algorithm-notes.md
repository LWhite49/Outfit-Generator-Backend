#2/29/24

- The frontend and backend framework is complete, we are ready to start matching clothes

- Each time this algorithm runs, there will be approximately 200 tops, 200 bottoms, and 200 shoes to pick from

- Each time this algorithm runs, it will return approximately 30 outfits made from the items specified above

- Each "outfit" is an object with three attributes, "top", "bottom", and "shoes", where each's value is the document from the collection

- It will reference a static matrix, where a 180 x 180 grid will rank each possible color combination by a percentage of matching

- The matrix will consider:
    - The closeness in hue between colors
    - The neutrality of a color (Eg. Gray will never truly pair POORLY with any color)
    - Complementary Colors via hue

- Things to consider for pairing clothing:
    - The primary colors of each item should pair well
    - The primary color of one item should be secondary to the other items
    - If one item has lots of featured colors, the other items should have less to accent the piece
    - Never use one article more than three times per request
    - Never place outfits with a shared article next to eachother in the return array

- General process for making an outfit, baseline:
    - Start by picking a random top, bottom, or shoe from the pallet
    - Selection process will follow the cycle Top => Bottom => Shoe => Top. (Eg. If we start with a random bottom, shirt will be picked last)
    - Find the 2 best matching items in the next sequential catagory
    - For all three of these pairs, find the 2 best items from the last catagory
    - Assign all 4 of these outfits in the tree a score, and return the best one.
    - Do this process however many times specified by frontend.

- In: Pallet of 200 top objects, 200 bottom objects, 200 shoe objects.
- Out: Array of x outfits, where each outfit is an object with attributes "top", "bottom", and "shoes"