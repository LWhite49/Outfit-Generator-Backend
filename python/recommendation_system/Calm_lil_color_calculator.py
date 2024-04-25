def calculate_weighted_average(similarity, neutrality, complementary, user_preference):
    # Define weighted percentages
    similarity_weight = 0.25
    neutrality_weight = 0.20
    complementary_weight = 0.25
    user_preference_weight = 0.30

    # Calculate weighted scores
    similarity_score = similarity * similarity_weight
    neutrality_score = neutrality * neutrality_weight
    complementary_score = complementary * complementary_weight
    user_preference_score = user_preference * user_preference_weight

    # Calculate total weighted score
    total_weighted_score = similarity_score + neutrality_score + complementary_score + user_preference_score

    # Round the weighted average to the nearest integer
    rounded_average = round(total_weighted_score)

    return rounded_average

def main():
    # Get input scores for each criterion
    similarity = int(input("Enter similarity score (1-10): "))
    neutrality = int(input("Enter neutrality score (1-10): "))
    complementary = int(input("Enter complementary score (1-10): "))
    user_preference = int(input("Enter user preference score (1-10): "))

    # Calculate weighted average
    weighted_average = calculate_weighted_average(similarity, neutrality, complementary, user_preference)

    # Output the rounded integer average
    print("Weighted Average Score:", weighted_average)

if __name__ == "__main__":
    main()
