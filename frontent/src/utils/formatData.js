const formatData = (datestring)=>{

    return new Date(datestring).toLocaleString('en-IN',{
        day:'numeric',
        month:'long',
        year:'numeric',
        hour:'numeric',
        minute:'2-digit',
        hour12:true
    });

};

export default formatData ;