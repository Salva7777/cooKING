using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    public partial class IngredientDangers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "GlutenFree",
                table: "Ingredients",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "LactoseFree",
                table: "Ingredients",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Veggie",
                table: "Ingredients",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GlutenFree",
                table: "Ingredients");

            migrationBuilder.DropColumn(
                name: "LactoseFree",
                table: "Ingredients");

            migrationBuilder.DropColumn(
                name: "Veggie",
                table: "Ingredients");
        }
    }
}
