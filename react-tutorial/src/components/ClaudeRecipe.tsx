import { ClaudeRecipeProps } from "../interfaces";
import Markdown from "react-markdown"

export default function ClaudeRecipe({ recipe }: ClaudeRecipeProps) {
    if (!recipe) {
        return null;
    }

    return (
        <section className="w-[40%] mx-auto rounded-lg bg-white p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Suggested recipe</h2>
            <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                <Markdown>{recipe}</Markdown>
            </div>
        </section>
    );
}