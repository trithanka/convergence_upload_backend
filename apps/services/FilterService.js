// ---------------- add filter  service ------------------
const addFilterService = async (main_query, query_params, like_params, equal_params,table) => {
    Object.entries(like_params).forEach(([key, value]) => {
        if (value) {
            main_query += ` AND ${table}.${key} LIKE ?`;
            query_params.push(`%${value}%`);
        }
    });
    // ---------------- where ----------------
    Object.entries(equal_params).forEach(([key, value]) => {
        if (value) {
            main_query += ` AND ${table}.${key} = ?`;
            query_params.push(`${value}`);
        }
    });
    return [
        main_query,
        query_params,
    ];
}
module.exports={
    addFilterService
};