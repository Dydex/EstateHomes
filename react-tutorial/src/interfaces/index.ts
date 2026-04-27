export interface MainProps {
    img: string;
    location: string;
    googleMapsUrl: string;
    title: string;
    dates: string;
    description: string;
}

export interface IngredientsListProps {
    ing: string[];
    showRecipe: () => void; 
}

export interface ClaudeRecipeProps {
    recipe: string;
}