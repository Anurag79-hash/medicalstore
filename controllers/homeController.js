const Medicine=require("../models/Medicine");

exports.homePage=async (req,res)=>{
    try{
        let {category , form} =req.query;
        let filter={};
        if(category && category!=="all"){
            filter.category=category;
        }
        if(form && form !=="all"){
            filter.form=form;
        }
        const medicines=await Medicine.find(filter);
        const categories=await Medicine.distinct("category");
        const forms=await Medicine.distinct("form");
        res.render("user/home",{
            medicines,categories,forms,
            selectedCategory:category || "all",
            selectedForm:form ||"all"
        });

    }catch(err){
        console.log(err);
        res.send("Something went wrong "+err);
    }
}