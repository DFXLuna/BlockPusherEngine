﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BlockPusher.Controllers
{
    public class PlayController : Controller
    {
        // GET: Play
        public ActionResult Index()
        {

            var result = new FilePathResult("~/Views/Play/Index.html", "text/html");
            return result;
            //return View();
        }
    }
}