class Utils
{

    // método estático que retorna a data e hora em formato texto
    static dateFormat(dt)
    {
        return dt.getDate()           + '/'  +          
               (dt.getMonth()+1)      + '/'  +  
               dt.getFullYear()       + "  " + 
               dt.getHours()          + ':'  +
               dt.getMinutes();
    }

}