if(typeof String.prototype.levenshtein === 'undefined'){
    String.prototype.levenshtein = function(str){
        var cost = [];
        var n = str.length;
        var m = this.length;
        var i;
        var j;
        if(n == 0){
            return 0;
        }
        if(m == 0){
            return 0;
        }
        for(i = 0; i <= n; i++){
            cost[i] = [];
        }
        for(i = 0; i <= n; i++){
            cost[i][0] = i;
        }
        for(j = 0; j <= m; j++){
            cost[0][j] = j;
        }
        for(i = 1; i <= n; i++){
            var x = str.charAt(i-1);
            for(j = 1; j<= m; j++){
                var y = this.charAt(j-1);
                if(x == y){
                   cost[i][j] = cost[i-1][j-1];
                }else{
                   cost[i][j] = 1 + Math.min(cost[i-1][j-1], cost[i][j-1], cost[i-1][j]);
                }
            }
        }
        return cost[n][m];
    }
}

