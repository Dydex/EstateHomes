import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.REACT_APP_HF_ACCESS_TOKEN);

export async function getRecipeFromMistral(ingredientsArr: string[]) {
  const ingredientsString = ingredientsArr.join(", ");

  try {
    const response = await (client as any).chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: "You are a recipe assistant. Format in markdown.",
        },
        {
          role: "user",
          content: `I have ${ingredientsString}. Suggest a recipe.`,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (err: any) {
    console.error("FULL ERROR:", err);
  }
}