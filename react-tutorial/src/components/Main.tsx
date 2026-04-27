import { MainProps } from "../interfaces";
import { useState } from "react";
import ClaudeRecipe from "./ClaudeRecipe";
import IngredientsList from "./IngredientsList";
import { getRecipeFromMistral } from "../ai";

export default function Main() {
  const [ingredients, setIngredients] = useState<string[]>([]);

  // const [recipeShown, setRecipeShown] = useState<boolean>(false);

  const [recipe, setRecipe] = useState("");

  // function showRecipe() {
  //   setRecipeShown((prev) => !prev);
  // }

  async function showRecipe() {
    const recipeMarkdown = await getRecipeFromMistral(ingredients);
    setRecipe(recipeMarkdown || "");
  }

  const IngredientList = ingredients.map((ing) => (
    <li className="flex items-start py-2">
      <span className="mr-1">•</span>
      <span>{ing}</span>
    </li>
  ));

  // function handleSubmit(e: any) {
  //     e.preventDefault()
  //     const formData = new FormData(e.currentTarget)
  //     const newIngredient = formData.get("ingredient") as string
  //     setIngredients(prev => [...prev, newIngredient])
  // }

  function addIng(formData: any) {
    const newIngredient = formData.get("ingredient") as string;
    setIngredients((prev) => [...prev, newIngredient]);
  }

  return (
    <>
      <main className="flex flex-col justify-center gap-12 my-8">
        <div className="w-[40%] mx-auto flex items-start ">
          <form action={addIng} className="flex justify-center gap-4">
            <input
              type="text"
              placeholder="e.g oregano"
              className="pl-2 rounded-md"
              name="ingredient"
            />
            <button
              className="rounded-md bg-black text-white pl-6 pr-6 py-1.5"
              type="submit"
            >
              + Add ingredient
            </button>
          </form>
        </div>

        {ingredients.length > 0 && (
          <>
            <section className="flex flex-col items-start w-[40%] mx-auto ">
              <h1 className="text-2xl font-medium py-4">
                Ingredients on hand:
              </h1>
              <ul>{IngredientList}</ul>
            </section>
          </>
        )}

        <IngredientsList ing={ingredients} showRecipe={showRecipe} />
        <ClaudeRecipe recipe={recipe} />
      </main>
    </>
  );
}
