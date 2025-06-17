// This is a temporary file to show the correct implementation
// Copy this function into your Placement_Prediction1.jsx file

const submitRatings = async () => {
    setIsSubmitting(true);
    const url = "https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/post_field_data";
    
    // Create the data structure according to the comment example
    const formattedRatings = {};
    
    // Process all skill ratings
    Object.entries(skillRatings).forEach(([key, rating]) => {
        // Key format is "fieldKey-category-skillName"
        const [fieldKey, category, ...skillParts] = key.split('-');
        const skill = skillParts.join('-'); // Handle skill names that might contain hyphens
        
        // Get the actual field name based on fieldKey
        let fieldName;
        if (fieldKey === "field1") fieldName = field1;
        else if (fieldKey === "field2") fieldName = field2;
        else if (fieldKey === "field3") fieldName = field3;
        
        if (fieldName && fieldName !== "Not Selected") {
            // Create the combined field:category key
            const fieldCategoryKey = `"${fieldName}":"${category}"`;
            
            // Initialize if not exists
            if (!formattedRatings[fieldCategoryKey]) {
                formattedRatings[fieldCategoryKey] = {};
            }
            
            // Determine if this is a frontend or backend skill
            // This is a simplified example - adjust based on your actual data
            const skillType = skill.toLowerCase().includes('html') || 
                             skill.toLowerCase().includes('css') || 
                             skill.toLowerCase().includes('react') ? 
                             "FrontEnd" : "Backend";
            
            // Create skill type object if it doesn't exist
            if (!formattedRatings[fieldCategoryKey][skillType]) {
                formattedRatings[fieldCategoryKey][skillType] = {};
            }
            
            // Add the skill rating
            formattedRatings[fieldCategoryKey][skillType][skill] = rating;
        }
    });
    
    const data = {
        email: localStorage.getItem("email") || "test@example.com",
        data: formattedRatings
    };
    
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert("Ratings submitted successfully!");
        navigate("/profiledata");
    } catch (error) {
        alert("Submission failed. Please try again.");
        console.error("Error submitting ratings:", error);
    } finally {
        setIsSubmitting(false);
    }
};