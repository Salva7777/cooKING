import { useEffect } from "react";
import { useStore } from "../../stores/store";

export default function IngredientNamesOptions() {
    const nameoptions = [{ text: '', value: '', disabled: true }];
    nameoptions.shift();
    const { ingredientStore } = useStore();
    const { ingredientsById, loadIngredients } = ingredientStore;
    useEffect(() => {
        loadIngredients();
    }, [loadIngredients]);
    ingredientsById.map(ingredient => {
        nameoptions.push({ text: ingredient.name, value: ingredient.id, disabled: true })
    }
    )
    nameoptions.sort(function (a, b) {
        if (a.text > b.text) {
            return 1;
        }
        if (a.text < b.text) {
            return -1;
        }
        return 0;
    });
    return nameoptions;
}