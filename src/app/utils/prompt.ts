export const getDiagnosisPrompt = (symptoms: string) => `
You are a medical assistant. 
The patient describes: ${symptoms}
Identify possible conditions, suggest basic prevention measures, 
and always add: "Consult a licensed doctor before acting."
`;

export const getDietPlanPrompt = (symptoms: string) => `
You are a medical nutrition assistant.  
The patient has the following symptoms: ${symptoms}.

Generate a personalized 7-day diet plan that includes:
- Breakfast
- Mid-morning snack
- Lunch
- Evening snack
- Dinner

Also include:
- Foods to avoid
- Nutritional notes per day
- Water intake advice

Format strictly as a markdown table.
Add: "This is not medical advice. Please consult a healthcare professional."
`;
