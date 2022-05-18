using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    public partial class UserIngredients : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Measure",
                table: "UserIngredients");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "UserIngredients");

            migrationBuilder.AddForeignKey(
                name: "FK_UserIngredients_AspNetUsers_AppUserId",
                table: "UserIngredients",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserIngredients_Ingredients_IngredientId",
                table: "UserIngredients",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserIngredients_AspNetUsers_AppUserId",
                table: "UserIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_UserIngredients_Ingredients_IngredientId",
                table: "UserIngredients");

            migrationBuilder.AddColumn<string>(
                name: "Measure",
                table: "UserIngredients",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Quantity",
                table: "UserIngredients",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
