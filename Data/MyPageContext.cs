using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyPage.Models;

namespace MyPage.Data
{
    public class MyPageContext : DbContext
    {
        public MyPageContext (DbContextOptions<MyPageContext> options)
            : base(options)
        {
        }
    }
}
