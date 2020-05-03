const TaskModel = require('../model/TaskModel');
const { isPast } = require('date-fns');

const TaskValidation = async (req, res, next) => {
    const {macaddress, type, title, description, when} = req.body;

    if(!macaddress){
        return res.status(400).json({error: 'macaddress is required!'});
    } else if(!type){
        return res.status(400).json({error: 'type is required!'});
    } else if(!title){
        return res.status(400).json({error: 'title is required!'});
    } else if(!description){
        return res.status(400).json({error: 'description is required!'});
    } else if(!when){
        return res.status(400).json({error: 'Date and time are required!'})
    } else if(isPast(new Date(when))){
        return res.status(400).json({error: 'Your task is old!'});
    } else{
        let exists;
        
        if(req.params.id){
            exists = await TaskModel.findOne({
                '_id':{'$ne' : req.params.id}, //$ne = not exists
                'when': {'$eq' : new Date(when)}, //$eq = equals
                'macaddress' : {'$in' : macaddress} //$in = in
            });
        } else {
            exists = await TaskModel.findOne({
                'when': {'$eq' : new Date(when)},
                'macaddress' : {'$in' : macaddress}
            });
        }

        if(exists){
            return res.status(400).json({error: 'There is already a task in the same data/time'})
        }
        next();
    }
}

module.exports = TaskValidation;