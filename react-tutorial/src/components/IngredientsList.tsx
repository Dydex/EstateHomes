import { IngredientsListProps } from "../interfaces";

export default function IngredientsList({
  ing,
  showRecipe,
}: IngredientsListProps) {
  return (
    <>
      {ing.length > 3 && (
        <section className="flex w-[40%] justify-between mx-auto p-8 bg-gray-200 ">
          <div>
            <h1 className="flex items-start">Ready for a recipe?</h1>
            <p className="flex items-start">
              Generate a recipe from your list of ingredients.{" "}
            </p>
          </div>

          <div className="bg-orange-500 pl-2 pr-2 rounded-md flex items-center">
            <button onClick={showRecipe} type="submit">
              Get a Recipe
            </button>
          </div>
        </section>
      )}
    </>
  );
}
