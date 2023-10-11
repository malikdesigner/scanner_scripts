<?php
if (!(class_exists('Dbase'))):
class Dbase {
	var $db_format;
	var $write_dbLink;
	//var $read_dbLink;

	var $USER_NAME;
	var $USER_PWD;
	var $DATABASE;
	var $db_selected;

	var $debug = 0;
	var $error_debug = 1;

	var $site = "Monitoring Workflow";
	var $record_per_page = 15;

	function str2Url($str)	{
		$url_name = trim(strtolower($str));

		$url_name = str_replace(" ", "_", $url_name);
		$url_name = str_replace("-", "_", $url_name);
		$url_name = str_replace("/", "_", $url_name);
		$url_name = str_replace(".", "_", $url_name);
		$url_name = str_replace("?", "", $url_name);
		$url_name = str_replace(":", "_", $url_name);
		$url_name = str_replace("(", "_", $url_name);
		$url_name = str_replace(")", "_", $url_name);
		$url_name = str_replace("____", "_", $url_name);
		$url_name = str_replace("___", "_", $url_name);
		$url_name = str_replace("__", "_", $url_name);

		$url_name = urlencode($url_name);
		return $url_name;
	}

	function validateLogin($login, $pwd) {
			$row = $this->selectSRow(array("Id"), "tblusers", "login='".$login."' AND password='".$pwd."'");
			//echo "<pre>"; print_r($this); exit;
			if ($row["Id"]!="") {
				session_start();
				$_SESSION["admin_id"] = $row["Id"];
				return true;
			}
			return false;
	}

	function setDBConnections($db_nsme="", $db_host="",$db_user="",$db_pass="") {
		if ($db_host) {
			$this->MYSQL_HOST = $db_host;
		} else {
			$this->MYSQL_HOST = "localhost";
		}
		if ($db_user) {
			$this->USER_NAME = $db_user;
		} else {
			$this->USER_NAME = "mikko";
		}
		if ($db_pass) {
			$this->USER_PWD = $db_pass;
		} else {
			$this->USER_PWD = "mikko";
		}

		if ($db_nsme) {
			$this->DATABASE = $db_nsme;
		} else {
			$this->DATABASE = "vp2";
		}
	}

	function closedb() {
		 mysqli_close($this->write_dbLink);
		 //mysql_close($this->read_dbLink);
	}

	function Dbase($db_nsme="", $db_host="",$db_user="",$db_pass=""){
		if ($db_nsme=="") {
			$db_nsme = "vp2";
		}

		$this->setDBConnections($db_nsme, $db_host, $db_user, $db_pass);

		//$this->setDBConnections($db_nsme, "139.162.219.194", "mcplive", "guniev999D");
		$this->write_dbLink = mysqli_connect($this->MYSQL_HOST, $this->USER_NAME, $this->USER_PWD, $this->DATABASE) or die("CONNECTION WRITE ERROR: ".mysqli_error());
		// $this->db_selected = mysqli_select_db($this->DATABASE, $this->write_dbLink);
		mysqli_set_charset($this->write_dbLink,'utf8');

		//$this->setDBConnections($db_nsme, "139.162.217.168", "mcplive", "guniev999D");
		//$this->setDBConnections($db_nsme, "139.162.219.194", "mcplive", "guniev999D");
		//$this->read_dbLink = mysql_pconnect($this->MYSQL_HOST, $this->USER_NAME, $this->USER_PWD, TRUE) or die("CONNECTION READ ERROR: ".mysql_error());
		//$this->db_selected = mysql_select_db($this->DATABASE, $this->read_dbLink);
		//mysql_set_charset('utf8', $this->read_dbLink);
	} //  end of Admin

	function get_db_name() {
		return $this->DATABASE;
	}

	function set_db_name($db_name) {
		$this->DATABASE = $db_name;
	}

	function escape($str="")
	{
		return(mysqli_escape_string($this->write_dbLink, $str));
	}
	//function insert(array $data, string table)
	function insert($data, $table, $debug = true) {
		if(!is_array($data))
			return(0);

		foreach($data as $key => $name) {
				$attribs[]	=	$key;
				$values[]	=	"'" . $this->escape(stripslashes($name)) . "'";
		}
		$attribs=implode(",", $attribs);
		$values = implode(",", $values);
		$query = "insert into $table ($attribs) values ($values)";
		$this->sql = $query;
		//echo $query;
		if ($this->debug==1 && $debug) {
			$this->log();
		}

		if (mysqli_query($this->write_dbLink,$query)) {
			return mysqli_insert_id($this->write_dbLink);
		} else {
			if ($this->error_debug==1 && $debug) {
				$this->error_log();
			}
			return false;
		}
	}

	function insert_ignoreDuplicates($data, $table) {
		if(!is_array($data))
			return(0);

		foreach($data as $key => $name) {
			$attribs[]	=	$key;
			$values[]	=	"'" . $this->escape(stripslashes($name)) . "'";
		}
		$attribs=implode(",", $attribs);
		$values = implode(",", $values);
		$query = "insert into $table ($attribs) values ($values)";
		$this->sql = $query;
		if ($this->debug==1) {
			$this->log();
		}
		@mysqli_query($this->write_dbLink,$query);
	}

	function exec_query($query) {
		$this->sql = $query;
		if ($this->debug==1) {
			$this->log();
		}
		if (mysqli_query($this->write_dbLink,$query)) {
			return true;
		} else {
			if ($this->error_debug==1) {
				$this->error_log();
			}
			return false;
		}


	}
	function execute_query($query) {
		$this->sql = $query;
		if ($this->debug==1) {
			$this->log();
		}
		if ($r = mysqli_query($this->write_dbLink,$query)) {
			return $r;
		} else {
			if ($this->error_debug==1) {
				$this->error_log();
			}
			return false;
		}


	}
	function selectIndex($retField, $table, $index, $value) {
		$q = "select $retField as RET from $table Where $index=$value";
		$r = mysqli_query($this->write_dbLink,$q);
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$row=mysqli_fetch_object($r);
		if (mysqli_num_rows($r)>0) {
			return $row->RET;
		} else {
			if ($this->error_debug==1) {
				$this->error_log();
			}
			return false;
		}
	}
	//** function select (array $retField, string $table, string $where)
	function select($retField, $table, $where="", $groupby="", $orderby="", $limit="") {
		$fields = implode(",", $retField);
		if ($where!="") {
			$q = "select $fields from $table WHERE $where";
		} else {
			$q = "select $fields from $table";
		}
		if ($groupby!="") {
			$q .= " GROUP BY $groupby";
		}
		if ($orderby!="") {
			$q .= " ORDER BY $orderby";
		}
		if ($limit!="") {
			$q .= " LIMIT $limit";
		}
		//echo "$q";exit;

		//echo $q;
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$r = mysqli_query($this->write_dbLink,$q);
		if (!($r)) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
		}
		$num=mysqli_num_rows($r);
		$i=0;
		while ($row=mysqli_fetch_object($r)) {
			$cont[$i] = $row;
			$i++;
		}
		if (mysqli_num_rows($r)>0) {
			return $cont;
		}
	}

	function countfeilds($retField, $table, $where="") {
		if(is_array($retField)){
			$fields = implode(",", $retField);
		}else{
			$fields=$retField;
		}
		if ($where!="") {
			$q = "select $fields from $table WHERE $where";
			$this->sql = $q;
			if ($this->debug==1) {
				$this->log();
			}
			$r = mysqli_query($this->write_dbLink,$q);
			return mysqli_num_rows($r);
		}
	}


	function selectfeilds($retField, $table, $where="") {
		if(is_array($retField)){
			$fields = implode(",", $retField);
		}else{
			$fields=$retField;
		}
		if ($where!="") {
			$q = "select $fields from $table WHERE $where";

			$this->sql = $q;
			if ($this->debug==1) {
				$this->log();
			}
			$r = mysqli_query($this->write_dbLink,$q);
			if (!($r)) {
				if ($this->error_debug==1) {
					$this->error_log();
				}
			}
			$row=mysqli_fetch_array($r);
			return $row;
		}
	}
	//** function select (array $retField, string $table, string $where)
	function selectAll($table, $where="") {
		$q="SHOW COLUMNS FROM $table";
		$r = mysqli_query($this->write_dbLink,$q);
		while ($res=mysqli_fetch_array($r)) {
			//echo $res[1]."<br>";
			if (($res[1]=="timestamp14") || ($res[1]=="datetime")) {
				$retField[]="DATE_FORMAT($res[0], '%d %b %Y at %H:%i:%s') AS $res[0]";
			} else {
				$retField[]=$res[0];
			}
		}

		$fields = implode(",", $retField);
		$q = "select $fields from $table $where";
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$r = mysqli_query($this->write_dbLink,$q);
		$num=mysqli_num_rows($r);
		$i=1;
		while ($row=mysqli_fetch_object($r)) {
			$cont[$i] = $row;
			$i++;
		}
		if (mysqli_num_rows($r)>0) {
			return $cont;
		}
	}

	function selectSRow($retField, $table, $where="", $groupby="", $orderby="", $limit="") {
		$fields = implode(",", $retField);
		if ($where!="") {
			$q = "select $fields from $table WHERE $where";
		} else {
			$q = "select $fields from $table";
		}
		if ($groupby!="") {
			$q .= " GROUP BY $groupby";
		}
		if ($orderby!="") {
			$q .= " ORDER BY $orderby";
		}
		if ($limit!="") {
			$q .= " LIMIT $limit";
		}
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$r = mysqli_query($this->write_dbLink,$q);
		if (!($r)) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
		}
		$num=mysqli_num_rows($r);
		$i=1;
		$cont=array();
		$row=mysqli_fetch_array($r);
		$cont = $row;
		$i++;
		return $cont;
	}

	function lastID() {
		return mysqli_insert_id($this->write_dbLink);
	}

	function checkIfAlready($table, $where, $groupby="", $orderby="", $limit="") {
		if ($where!="") {
			$q = "select * from $table WHERE $where";
		} else {
			$q = "select * from $table";
		}
		if ($groupby!="") {
			$q .= " GROUP BY $groupby";
		}
		if ($orderby!="") {
			$q .= " ORDER BY $orderby";
		}
		if ($limit!="") {
			$q .= " LIMIT $limit";
		}
		//$q = "select $fields from $table $where";
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$r = mysqli_query($this->write_dbLink,$q);
		if (!($r)) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
		}
		$num=mysqli_num_rows($r);
		//echo "query $q result = ".$num."<br><br><br><br>";
		if ($num!=0) {
			return true;
		}
		return false;
	}

	function selectIfExist($retField, $table, $where, $groupby="", $orderby="", $limit="") {
		$fields = implode(",", $retField);
		if ($where!="") {
			$q = "select $fields from $table WHERE $where";
		} else {
			$q = "select $fields from $table";
		}
		if ($groupby!="") {
			$q .= " GROUP BY $groupby";
		}
		if ($orderby!="") {
			$q .= " ORDER BY $orderby";
		}
		if ($limit!="") {
			$q .= " LIMIT $limit";
		}
		//$q = "select $fields from $table $where";
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$r = mysqli_query($this->write_dbLink,$q);
		if (!($r)) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
		}
		$num=mysqli_num_rows($r);
		//echo "query $q result = ".$num."<br><br><br><br>";
		if ($num!=0) {
			return true;
		}
		return false;
	}

	function is_url( $url )	{
		 if ( !( $parts = @parse_url( $url ) ) )
			  return false;
		 else {
		 if ( $parts[scheme] != "http" && $parts[scheme] != "https" && $parts[scheme] != "ftp" && $parts[scheme] != "gopher" )
			  return false;
		 else if ( !eregi( "^[0-9a-z]([-.]?[0-9a-z])*\.[a-z]{2,3}$", $parts[host], $regs ) )
			  return false;
		 else if ( !eregi( "^([0-9a-z-]|[\_])*$", $parts[user], $regs ) )
			  return false;
		 else if ( !eregi( "^([0-9a-z-]|[\_])*$", $parts[pass], $regs ) )
			  return false;
		 else if ( !eregi( "^[0-9a-z/_\.@~\-]*$", $parts[path], $regs ) )
			  return false;
		 else if ( !eregi( "^[0-9a-z?&=#\,]*$", $parts[query], $regs ) )
			  return false;
		 }
		 return true;
	}

	function lib_getmicrotime() {
		 list($usec, $sec) = explode(" ",microtime());
		 return ((float)$usec + (float)$sec);
  	}

	function log() {
		$fp = fopen("sql.log", "a");
		if(flock($fp, LOCK_EX))
		{
			$sql = str_replace("\n", " ", $this->sql);
			fputs($fp, date("d-m-Y h:i:s")." --> $sql\n");
			flock($fp, LOCK_UN);
		}
		fclose($fp);
	}

	function error_log() {
		$fp = fopen("sql_error.log", "a");
		if(flock($fp, LOCK_EX))
		{
			$sql = str_replace("\n", " ", $this->sql);
			fputs($fp, date("d-m-Y h:i:s")." --> $sql\n");
			flock($fp, LOCK_UN);
		}
		fclose($fp);

		$strHTML = "<HTML><HEAD><TITLE>MYSQL DEBUG CONSOLE</TITLE></HEAD><BODY>";
		$strHTML .= "<div id='mysql_error_div'><table width='70%' align='center' border='0' cellspacing='0' cellpadding='0'>";
		$strHTML .="<tr><td width='1%' align='center' bordercolor='#000000' bgcolor='#FF0000'>&nbsp;</td>";
		$strHTML .="<td width='98%' align='center' bordercolor='#000000' bgcolor='#FF0000'><font color=#FFFFFF face='verdana' size='+1'>MySQL DEBUG CONSOLE</font> </td>";
		$strHTML .="<td width='1%' align='center' bordercolor='#000000' bgcolor='#FF0000'>&nbsp;</td></tr>";
		$strHTML .="<tr><td bgcolor='#FF0000'>&nbsp;</td><td>&nbsp;</td><td bgcolor='#FF0000'>&nbsp;</td></tr>";
		$strHTML .="<tr><td bgcolor='#FF0000'>&nbsp;</td><td style='padding-left:10px'><strong>Query:</strong></td><td bgcolor='#FF0000'>&nbsp;</td></tr>";
		$strHTML .="<tr><td bgcolor='#FF0000'>&nbsp;</td><td style='padding-left:20px'>$this->sql</td><td bgcolor='#FF0000'>&nbsp;</td></tr>";
		$strHTML .="<tr><td bgcolor='#FF0000'>&nbsp;</td><td>&nbsp;</td><td bgcolor='#FF0000'>&nbsp;</td></tr>";
		$strHTML .="<tr><td bgcolor='#FF0000'>&nbsp;</td><td style='padding-left:10px'><strong>Mysql Response:</strong></td><td bgcolor='#FF0000'>&nbsp;</td></tr>";
		$strHTML .="<tr><td bgcolor='#FF0000'>&nbsp;</td><td style='padding-left:20px'>".mysqli_error($this->write_dbLink)."</td><td bgcolor='#FF0000'>&nbsp;</td></tr>";
		$strHTML .="<tr><td bgcolor='#FF0000'>&nbsp;</td><td>&nbsp;</td><td bgcolor='#FF0000'>&nbsp;</td></tr>";
		$strHTML .="<tr><td colspan='3' bgcolor='#FF0000' height='2'></td></tr></table>";
		$strHTML .= "</div></BODY></HTML>";

		echo $strHTML;
		echo "<pre>"; print_r(debug_backtrace ());
	 }

	 function update($table="", $key="",$val="", $arr=array()) {
		if(!is_array($arr))
			return(0);

		$sql = array();
		while(list($k,$v) = each($arr))
		{
			$sql[] = "$k='" . $this->escape(stripslashes($v)) . "'";
		}

		$query = "UPDATE $table SET " . implode(", ", $sql) . " WHERE $key='$val'";
		$this->sql = $query;
		if ($this->debug==1) {
			$this->log();
		}
		return mysqli_query($this->write_dbLink,$query);
	 }

	 function update2($table="", $key="",$val="") {
		$query = "UPDATE $table SET ".$key." WHERE ".$val."";
		$this->sql = $query;
		if ($this->debug==1) {
			$this->log();
		}
		return mysqli_query($this->write_dbLink,$query);
	 }


	 function updateCondition($table="", $cond="", $arr=array(), $limit = '', $debug = true) {
		if(!is_array($arr))
			return(0);

		$sql = array();
		foreach ($arr as $k => $v) {
			$sql[] = "$k='" . $this->escape(stripslashes($v)) . "'";
		}
		// while(list($k,$v) = each($arr))
		// {
		// 	$sql[] = "$k='" . $this->escape(stripslashes($v)) . "'";
		// }

		if($limit!="") {
			$limit = "LIMIT $limit";
		}

		$query = "UPDATE $table SET " . implode(", ", $sql) . " WHERE $cond $limit";


		//$this->tz = $this->lib_getmicrotime();
		$this->sql = $query;
		if ($debug && $this->debug==1) {
			$this->log();
		}
		return mysqli_query($this->write_dbLink,$query);
	 }

	function delete($table="", $condition="") {
		$query = "DELETE FROM $table WHERE $condition";
		$this->sql = $query;
		if ($this->debug==1) {
			$this->log();
		}
		if (!(mysqli_query($this->write_dbLink,$query))) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
			return false;
		} else {
			return true;
		}
	 }

	function deleteAll($table="") {
		$query = "TRUNCATE $table";
		//$this->tz = $this->lib_getmicrotime();
		$this->sql = $query;
		if ($this->debug==1) {
			$this->log();
		}
		if (!(mysqli_query($this->write_dbLink,$query))) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
			return false;
		} else {
			return true;
		}
	 }

	function selectRows($table, $where="") {
		$q="SHOW COLUMNS FROM $table";
		$r = mysqli_query($this->write_dbLink,$q);
		while ($res=mysqli_fetch_array($r)) {
			//echo $res[1]."<br>";
			if (($res[1]=="timestamp14") || ($res[1]=="datetime")) {
				$retField[]="DATE_FORMAT($res[0], '%d %b %Y at %H:%i:%s') AS $res[0]";
			} else {
				$retField[]=$res[0];
			}
		}

		$fields = implode(",", $retField);
		$q = "select $fields from $table $where";
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$r = mysqli_query($this->write_dbLink,$q);
		$num=mysqli_num_rows($r);
		$i=1;
		while ($row=mysqli_fetch_array($r)) {
			$cont[$i] = $row;
			$i++;
		}
		if (mysqli_num_rows($r)>0) {
			return $cont;
		}
	}

	function select_array($retField, $table, $where="", $groupby="", $orderby="", $limit="") {
		$fields = implode(",", $retField);
		if ($where!="") {
			$q = "select $fields from $table WHERE $where";
		} else {
			$q = "select $fields from $table";
		}
		if ($groupby!="") {
			$q .= " GROUP BY $groupby";
		}
		if ($orderby!="") {
			$q .= " ORDER BY $orderby";
		}
		if ($limit!="") {
			$q .= " LIMIT $limit";
		}
		//echo "$q";exit;
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$r = mysqli_query($this->write_dbLink,$q);
		if (!($r)) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
		}
		$num=mysqli_num_rows($r);
		$i=1;
		while ($row=mysqli_fetch_array($r)) {
			$cont[$i] = $row;
			$i++;
		}
		if (mysqli_num_rows($r)>0) {
			return $cont;
		}
	}


		function select_assoc($retField, $table, $where="", $groupby="", $orderby="", $limit="") {
		$fields = implode(",", $retField);
		if ($where!="") {
			$q = "select $fields from $table WHERE $where";
		} else {
			$q = "select $fields from $table";
		}
		if ($groupby!="") {
			$q .= " GROUP BY $groupby";
		}
		if ($orderby!="") {
			$q .= " ORDER BY $orderby";
		}
		if ($limit!="") {
			$q .= " LIMIT $limit";
		}
		//echo "$q";exit;
		$this->sql = $q;
		if ($this->debug==1) {
			$this->log();
		}
		$r = mysqli_query($this->write_dbLink,$q);
		if (!($r)) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
		}
		$num=mysqli_num_rows($r);
		while ($row=mysqli_fetch_assoc($r)) {
			$cont[] = $row;
			$i++;
		}
		if (mysqli_num_rows($r)>0) {
			return $cont;
		}
	}


	function findPos($searchString, $string) {
		$pos = strpos($string, $searchString);

		if ($pos === false) {
			return false;
		} else {
			return true;
		}
	}

	function parseCSV_to_array($filename) {
		$row = 1;
		$handle = fopen($filename, "r");

 		while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
			$num = count($data);
			if ($row==1) {
				for ($c=0; $c < $num; $c++) {
					$keys[] =  $data[$c];
				}
				$row++;
			} else {
				$row++;

				for ($i=0; $i < $num; $i++) {
					$csv_rows[$keys[$i]][] = $data[$i];
				}
			}
		}
		return $csv_rows;
	}

	function putArrayIntoCSV($company_info, $filename) {
		$csv_data = implode(",", $company_info)."\n";

		if (!$handle = fopen($filename, 'a')) {
			 echo "Cannot open file ($filename)";
			 exit;
		}

		if (fwrite($handle, $csv_data) === FALSE) {
			echo "Cannot write to file ($filename)";
			exit;
		}

		fclose($handle);
	}

	function object_2_array($result) {
		$array = array();
		if (count($result)) {
			foreach ($result as $key=>$value) {
				if (is_object($value)) {
					$array[$key]=$this->object_2_array($value);
				} elseif (is_array($value)) {
					$array[$key]=$this->object_2_array($value);
				} else {
					$array[$key]=$value;
				}
			}
		}
		return $array;
	}

	function getPaging($table, $where="", $groupby="", $orderby="", $limit="") {
		if ($where!="") {
			$q = "select count(*) AS total from $table WHERE $where";
		} else {
			$q = "select count(*) AS total from $table";
		}
		if ($groupby!="") {
			$q .= " GROUP BY $groupby";
		}
		if ($orderby!="") {
			$q .= " ORDER BY $orderby";
		}
		if ($limit!="") {
			$q .= " LIMIT $limit";
		}
		$this->sql = $q;

		if ($this->debug==1) {
			$this->log();
		}

		$r = mysqli_query($this->write_dbLink,$q);
		if (!($r)) {
			if ($this->error_debug==1) {
				$this->error_log();
			}
		}
		$num=mysqli_num_rows($r);
		$i=0;
		while ($row=mysqli_fetch_object($r)) {
			$cont[$i] = $row;
			$i++;
		}
		if (mysqli_num_rows($r)>0) {

			$total_pages = ceil($cont[0]->total/$this->record_per_page);

			for ($i=0; $i<$total_pages; $i++) {
				$pages_array[] = $i+1;
			}
			$paging = array("total_records"=>$cont[0]->total,
							"record_per_page"=>$this->record_per_page,
							"total_pages"=>$total_pages,
							"pages_array"=>$pages_array);

			return $paging;
		}

	}
}
endif;
?>
